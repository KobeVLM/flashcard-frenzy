package com.marikit.flashcardfrenzy.auth.controller;

import com.marikit.flashcardfrenzy.auth.dto.*;
import com.marikit.flashcardfrenzy.auth.service.AuthService;
import com.marikit.flashcardfrenzy.common.ApiResponse;
import com.marikit.flashcardfrenzy.common.ResponseBuilder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
        return ResponseBuilder.created(authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return ResponseBuilder.success(authResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@Valid @RequestBody RefreshRequest request) {
        AuthResponse authResponse = authService.refresh(request);
        return ResponseBuilder.success(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Map<String, String>>> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            authService.logout(token);
        }
        return ResponseBuilder.success(Map.of("message", "Successfully logged out"));
    }
}
