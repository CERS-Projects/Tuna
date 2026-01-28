package com.example.backend.auth.dto;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserInfo {
    @NotNull
    private Integer userId;
    @NotNull
    private Integer schoolId;
}
