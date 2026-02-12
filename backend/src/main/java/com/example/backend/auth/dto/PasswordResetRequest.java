package com.example.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class PasswordResetRequest {

    @NotBlank
    String token;

    @NotBlank
    String newPassword;
}
