package com.marikit.flashcardfrenzy.auth.service;

import com.marikit.flashcardfrenzy.auth.dto.ChangePasswordRequest;
import com.marikit.flashcardfrenzy.auth.dto.UpdateProfileRequest;
import com.marikit.flashcardfrenzy.auth.dto.UserResponse;
import com.marikit.flashcardfrenzy.auth.entity.User;
import com.marikit.flashcardfrenzy.auth.repository.UserRepository;
import com.marikit.flashcardfrenzy.common.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key}")
    private String supabaseServiceRoleKey;

    @Value("${supabase.storage.bucket:avatars}")
    private String storageBucket;

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp"
    );

    @Override
    public UserResponse getProfile(User user) {
        return buildUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(User user, UpdateProfileRequest request) {
        if (request.getFirstName() != null && !request.getFirstName().isBlank()) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null && !request.getLastName().isBlank()) {
            user.setLastName(request.getLastName());
        }
        user = userRepository.save(user);
        return buildUserResponse(user);
    }

    @Override
    @Transactional
    public void changePassword(User user, ChangePasswordRequest request) {
        // Validate new password matches confirm
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AppException(
                    "VALID-001",
                    "Validation failed",
                    HttpStatus.BAD_REQUEST,
                    Map.of("confirmPassword", "Passwords do not match"));
        }

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new AppException(
                    "AUTH-001",
                    "Current password is incorrect",
                    HttpStatus.UNAUTHORIZED);
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public UserResponse uploadPhoto(User user, MultipartFile file) {
        // Validate file
        if (file.isEmpty()) {
            throw new AppException(
                    "VALID-001",
                    "File is empty",
                    HttpStatus.BAD_REQUEST);
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new AppException(
                    "VALID-001",
                    "Only JPEG, PNG, GIF, and WebP images are allowed",
                    HttpStatus.BAD_REQUEST);
        }

        // Determine file extension
        String extension = switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/gif" -> ".gif";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };

        String objectPath = user.getId().toString() + extension;

        try {
            // Upload to Supabase Storage
            // POST /storage/v1/object/{bucket}/{path}
            String uploadUrl = supabaseUrl + "/storage/v1/object/" + storageBucket + "/" + objectPath;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + supabaseServiceRoleKey);
            headers.setContentType(MediaType.parseMediaType(contentType));
            // Upsert — overwrite if file already exists
            headers.set("x-upsert", "true");

            HttpEntity<byte[]> entity = new HttpEntity<>(file.getBytes(), headers);

            restTemplate.exchange(uploadUrl, HttpMethod.POST, entity, String.class);

            // Build public URL
            String publicUrl = supabaseUrl + "/storage/v1/object/public/" + storageBucket + "/" + objectPath;

            user.setProfilePhotoUrl(publicUrl);
            user = userRepository.save(user);

            return buildUserResponse(user);

        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            throw new AppException(
                    "SYS-001",
                    "Failed to upload photo: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private UserResponse buildUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .role(user.getRole().name())
                .build();
    }
}
