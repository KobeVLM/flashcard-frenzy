package com.marikit.flashcardfrenzy.admin.controller;

import com.marikit.flashcardfrenzy.admin.dto.*;
import com.marikit.flashcardfrenzy.admin.service.AdminService;
import com.marikit.flashcardfrenzy.auth.entity.User;
import com.marikit.flashcardfrenzy.common.ApiResponse;
import com.marikit.flashcardfrenzy.common.ResponseBuilder;
import com.marikit.flashcardfrenzy.common.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getStats() {
        AdminStatsResponse response = adminService.getStats();
        return ResponseBuilder.success(response);
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<AdminUserListResponse>> getUsers() {
        AdminUserListResponse response = adminService.getUsers();
        return ResponseBuilder.success(response);
    }

    @PatchMapping("/users/{id}")
    public ResponseEntity<ApiResponse<AdminUserResponse>> updateUserStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserStatusRequest request) {

        AdminUserResponse response = adminService.updateUserStatus(id, request);
        return ResponseBuilder.success(response);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Map<String, String>>> deleteUser(@PathVariable UUID id) {
        User currentAdmin = SecurityUtil.getCurrentUser();
        adminService.deleteUser(id, currentAdmin.getId());
        return ResponseBuilder.success(Map.of("message", "User deleted successfully"));
    }
}
