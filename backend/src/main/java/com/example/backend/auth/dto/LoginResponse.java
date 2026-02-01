package com.example.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

@Setter
@AllArgsConstructor
public class LoginResponse {
    @NonNull
    private Integer userId;
}
