package com.example.backend.auth.service;

import com.example.backend.auth.dto.LoginSelectRequest;
import com.example.backend.auth.dto.LoginTokenResponse;

public interface AuthService {
    LoginTokenResponse login(LoginSelectRequest loginSelectRequest);

    void logout(Integer userId);

    LoginTokenResponse refreshTokenCheck(String refreshToken);

}
