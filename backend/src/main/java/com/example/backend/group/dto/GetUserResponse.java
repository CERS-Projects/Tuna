package com.example.backend.group.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GetUserResponse {
    @NotBlank
    private String showUserId;
    @NotBlank
    private String userName;
    @NotNull
    private Integer grade;

    private Boolean isJoin = false;
}
