package com.example.backend.auth.service;

import com.example.backend.auth.dto.OtpRequest;

public interface OtpService {
    String createOtp(Integer userId);

    Integer confirmOtp(OtpRequest otpRequest);
}
