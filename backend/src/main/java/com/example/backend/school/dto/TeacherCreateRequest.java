package com.example.backend.school.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/*
 * 教師アカウント登録のためのDto
 */

@Setter
@Getter
public class TeacherCreateRequest {
    @NotBlank(message = "表示用ユーザIDの入力は必須です")
    @Size(min = 1, max = 20, message = "1文字以上、20文字以下で入力してください")
    private String showUserId;

    @NotBlank(message = "名前の入力は必須です")
    @Size(min = 1, max = 20, message = "1文字以上、20文字以下で入力してください")
    private String name;

    @NotBlank(message = "メールアドレスの入力は必須です")
    @Email
    @Size(min = 1, max = 254, message = "1文字以上、254文字以下で入力して下さい")
    private String mailAddress;
    
    @NotBlank(message = "パスワードの入力は必須です。")
    private String password;

    @NotNull
    @Min(value = 0)//管理者権限OFF
    @Max(value = 1)//管理者権限ON
    private Integer authorityFlag; 
}
