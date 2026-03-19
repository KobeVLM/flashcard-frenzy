package com.marikit.flashcardfrenzy.auth.controller;

import com.marikit.flashcardfrenzy.auth.dto.ChangePasswordRequest;
import com.marikit.flashcardfrenzy.auth.dto.UpdateProfileRequest;
import com.marikit.flashcardfrenzy.auth.dto.UserResponse;
import com.marikit.flashcardfrenzy.auth.entity.User;
import com.marikit.flashcardfrenzy.auth.service.UserService;
import com.marikit.flashcardfrenzy.common.ApiResponse;
import com.marikit.flashcardfrenzy.common.ResponseBuilder;
import com.marikit.flashcardfrenzy.common.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile() {
        User user = SecurityUtil.getCurrentUser();
        UserResponse response = userService.getProfile(user);
        return ResponseBuilder.success(response);
    }

    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@RequestBody UpdateProfileRequest request) {
        User user = SecurityUtil.getCurrentUser();
        UserResponse response = userService.updateProfile(user, request);
        return ResponseBuilder.success(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Map<String, String>>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {
        User user = SecurityUtil.getCurrentUser();
        userService.changePassword(user, request);
        return ResponseBuilder.success(Map.of("message", "Password changed successfully"));
    }

    @PostMapping("/me/photo")
    public ResponseEntity<ApiResponse<UserResponse>> uploadPhoto(@RequestParam("file") MultipartFile file) {
        User user = SecurityUtil.getCurrentUser();
        UserResponse response = userService.uploadPhoto(user, file);
        return ResponseBuilder.success(response);
    }
}
