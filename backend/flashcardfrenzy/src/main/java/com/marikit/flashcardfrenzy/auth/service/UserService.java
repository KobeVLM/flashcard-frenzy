package com.marikit.flashcardfrenzy.auth.service;

import com.marikit.flashcardfrenzy.auth.dto.ChangePasswordRequest;
import com.marikit.flashcardfrenzy.auth.dto.UpdateProfileRequest;
import com.marikit.flashcardfrenzy.auth.dto.UserResponse;
import com.marikit.flashcardfrenzy.auth.entity.User;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {

    UserResponse getProfile(User user);

    UserResponse updateProfile(User user, UpdateProfileRequest request);

    void changePassword(User user, ChangePasswordRequest request);

    UserResponse uploadPhoto(User user, MultipartFile file);
}
