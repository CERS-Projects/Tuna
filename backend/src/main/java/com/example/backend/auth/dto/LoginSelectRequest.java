package com.example.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@RequiredArgsConstructor
public class LoginSelectRequest {

    @NotBlank(message = "ユーザIDの入力は必須です")
    private String showUserId;
    @NotBlank(message = "パスワードの入力は必須です")
    private String password;

}
