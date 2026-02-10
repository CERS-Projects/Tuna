package com.example.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class PasswordResetMailRequest {

    @NonNull
    private String mailAddress;
}
