package com.example.backend.auth.dto;

import org.springframework.http.ResponseCookie;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginTokenResponse {
    @NotNull
    private String accessToken;
    @NotNull
    private ResponseCookie refreshToken;
}
