package com.marikit.flashcardfrenzy.auth.controller;

import com.marikit.flashcardfrenzy.auth.dto.AuthResponse;
import com.marikit.flashcardfrenzy.auth.dto.LoginRequest;
import com.marikit.flashcardfrenzy.auth.dto.RegisterRequest;
import com.marikit.flashcardfrenzy.auth.service.AuthService;
import com.marikit.flashcardfrenzy.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse authResponse = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(authResponse));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(authResponse));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Map<String, String>>> logout() {
        // Token validation is handled by the JWT filter in the security chain.
        // If execution reaches here, the token was valid and not expired.
        return ResponseEntity.ok(ApiResponse.success(Map.of("message", "Successfully logged out")));
    }
}
