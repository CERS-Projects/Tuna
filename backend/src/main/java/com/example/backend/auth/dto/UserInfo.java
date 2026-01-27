package com.example.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserInfo {
    @NotBlank
    private Integer userId;
    @NotBlank
    private Integer schoolId;
}
