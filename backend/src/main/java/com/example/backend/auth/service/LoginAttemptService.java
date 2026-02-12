package com.example.backend.auth.service;

import jakarta.servlet.http.HttpServletRequest;

public interface LoginAttemptService {
    void isStop(HttpServletRequest httpServletRequest, String userId);

    void loginFailed(String userId);

    void otpFailed(Integer userId, String otpToken);
}
