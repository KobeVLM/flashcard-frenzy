package com.marikit.flashcardfrenzy.admin.service;

import com.marikit.flashcardfrenzy.admin.dto.*;

import java.util.UUID;

public interface AdminService {

    AdminStatsResponse getStats();

    AdminUserListResponse getUsers();

    AdminUserResponse updateUserStatus(UUID userId, UpdateUserStatusRequest request);

    void deleteUser(UUID userId, UUID adminId);
}
