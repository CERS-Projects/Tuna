package com.example.backend.auth.service;

import com.example.backend.auth.dto.OtpRequest;
import com.example.backend.auth.dto.OtpResponse;

public interface OtpService {
    OtpResponse createOtp(Integer userId);

    Integer confirmOtp(OtpRequest otpRequest);
}
