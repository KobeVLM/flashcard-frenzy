package com.marikit.flashcardfrenzy.auth.service;

import com.marikit.flashcardfrenzy.auth.dto.*;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refresh(RefreshRequest request);

    void logout(String accessToken);
}
