package com.example.backend.auth.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class PasswordResetRequest {

    @NotNull
    String token;

    @NotNull
    String newPassword;
}
