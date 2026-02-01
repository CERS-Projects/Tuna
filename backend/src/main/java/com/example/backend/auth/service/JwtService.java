package com.example.backend.auth.service;

import com.example.backend.auth.dto.LoginTokenResponse;

public interface JwtService {
    LoginTokenResponse jwtCreate(Integer userId);

    LoginTokenResponse refreshTokenCheck(String refreshToken);
}
