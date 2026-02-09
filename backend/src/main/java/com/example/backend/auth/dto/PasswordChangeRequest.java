package com.example.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PasswordChangeRequest {

    @NotBlank
    private String password;

    @NotBlank
    private String newPassword;

    @NotBlank
    private String confirmPassword;

}
