package com.marikit.flashcardfrenzy.auth.service;

import com.marikit.flashcardfrenzy.auth.dto.*;
import com.marikit.flashcardfrenzy.auth.entity.Role;
import com.marikit.flashcardfrenzy.auth.entity.User;
import com.marikit.flashcardfrenzy.auth.repository.UserRepository;
import com.marikit.flashcardfrenzy.auth.security.JwtUtil;
import com.marikit.flashcardfrenzy.auth.security.TokenBlacklistService;
import com.marikit.flashcardfrenzy.common.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final TokenBlacklistService tokenBlacklistService;
    private final UserDetailsService userDetailsService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        // Validate password matches confirmPassword
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new AppException(
                    "VALID-001",
                    "Validation failed",
                    HttpStatus.BAD_REQUEST,
                    Map.of("confirmPassword", "Passwords do not match"));
        }

        // Check duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(
                    "DB-002",
                    "Duplicate entry",
                    HttpStatus.CONFLICT,
                    Map.of("email", "Email already exists"));
        }

        // Create and save user
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(Role.USER)
                .status("ACTIVE")
                .build();

        user = userRepository.save(user);

        // Generate tokens
        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(
                        "AUTH-001",
                        "Invalid credentials",
                        HttpStatus.UNAUTHORIZED));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AppException(
                    "AUTH-001",
                    "Invalid credentials",
                    HttpStatus.UNAUTHORIZED);
        }

        // Generate tokens
        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    @Override
    public AuthResponse refresh(RefreshRequest request) {
        String oldRefreshToken = request.getRefreshToken();

        try {
            // Check if token is blacklisted
            if (tokenBlacklistService.isBlacklisted(oldRefreshToken)) {
                throw new AppException(
                        "AUTH-004",
                        "Refresh token invalid or expired",
                        HttpStatus.UNAUTHORIZED);
            }

            // Validate the refresh token
            if (jwtUtil.isTokenExpired(oldRefreshToken)) {
                throw new AppException(
                        "AUTH-004",
                        "Refresh token invalid or expired",
                        HttpStatus.UNAUTHORIZED);
            }

            String email = jwtUtil.extractEmail(oldRefreshToken);
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            if (!jwtUtil.validateToken(oldRefreshToken, userDetails)) {
                throw new AppException(
                        "AUTH-004",
                        "Refresh token invalid or expired",
                        HttpStatus.UNAUTHORIZED);
            }

            // Blacklist the old refresh token
            long oldExpiry = jwtUtil.getExpirationMsFromToken(oldRefreshToken);
            tokenBlacklistService.invalidate(oldRefreshToken, oldExpiry);

            // Issue new token pair
            String newAccessToken = jwtUtil.generateAccessToken(userDetails);
            String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);

            User user = (User) userDetails;
            return buildAuthResponse(user, newAccessToken, newRefreshToken);

        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            throw new AppException(
                    "AUTH-004",
                    "Refresh token invalid or expired",
                    HttpStatus.UNAUTHORIZED);
        }
    }

    @Override
    public void logout(String accessToken) {
        try {
            long expiry = jwtUtil.getExpirationMsFromToken(accessToken);
            tokenBlacklistService.invalidate(accessToken, expiry);
        } catch (Exception e) {
            // Token might be malformed but logout should still succeed silently
        }
    }

    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .role(user.getRole().name())
                .build();

        return AuthResponse.builder()
                .user(userResponse)
                .token(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
}
