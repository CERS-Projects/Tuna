package com.example.backend.auth.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RedisOtp {
    @NotNull
    private Integer userId;
    @NotNull
    private String otp;
}
