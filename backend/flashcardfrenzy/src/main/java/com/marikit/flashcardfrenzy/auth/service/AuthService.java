package com.marikit.flashcardfrenzy.auth.service;

import com.marikit.flashcardfrenzy.auth.dto.AuthResponse;
import com.marikit.flashcardfrenzy.auth.dto.LoginRequest;
import com.marikit.flashcardfrenzy.auth.dto.RegisterRequest;
import com.marikit.flashcardfrenzy.auth.entity.Role;
import com.marikit.flashcardfrenzy.auth.entity.User;
import com.marikit.flashcardfrenzy.auth.repository.UserRepository;
import com.marikit.flashcardfrenzy.auth.security.JwtService;
import com.marikit.flashcardfrenzy.common.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        // Validate password matches confirmPassword
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new AppException(
                    "VALID-001",
                    "Validation failed",
                    HttpStatus.BAD_REQUEST,
                    Map.of("confirmPassword", "Passwords do not match"));
        }

        // Validate password strength (at least 1 uppercase, 1 lowercase, 1 digit)
        if (!isPasswordStrong(request.getPassword())) {
            throw new AppException(
                    "VALID-001",
                    "Validation failed",
                    HttpStatus.BAD_REQUEST,
                    Map.of("password",
                            "Password must contain at least one uppercase letter, one lowercase letter, and one digit"));
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
                .fullName(request.getFullName())
                .role(Role.USER)
                .build();

        userRepository.save(user);

        // Generate JWT token
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

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

        // Generate JWT token
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    private boolean isPasswordStrong(String password) {
        boolean hasUpper = password.chars().anyMatch(Character::isUpperCase);
        boolean hasLower = password.chars().anyMatch(Character::isLowerCase);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        return hasUpper && hasLower && hasDigit;
    }
}
