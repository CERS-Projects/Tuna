package com.example.backend.accounts.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentCreateRequest {
    @NotBlank(message = "表示用のユーザIDの入力は必須です")
    @Size(min = 1, max = 20)
    private String showUserId;

    @NotBlank(message = "パスワードの入力は必須です")
    private String password;

    @NotBlank(message = "メールアドレスの入力は必須です")
    @Email
    @Size(min = 1, max = 254)
    private String mailAddress;

    @NotBlank(message = "名前の入力は必須です")
    @Size(min = 1, max = 50)
    private String name;

    /* 
     * ※申請した学校に応じて@Maxの値の変更をしてください※
     * 　最高学年が3年の場合 : @Max(3)
     * 　最高学年が6年の場合 : @Max(6) 
     */
    @NotNull(message = "学年の入力は必須です")
    @Min(1)
    @Max(3)
    private Integer grade;
    
    @NotNull(message = "入学年度の入力は必須です")
    private LocalDate admissionDate;

    /* 
     * 卒業年度情報(Nullは許容)
     */
    private LocalDate graduateDate;

    @NotNull
    @Min(1)
    @Max(99999)
    private Integer schoolId;
}
