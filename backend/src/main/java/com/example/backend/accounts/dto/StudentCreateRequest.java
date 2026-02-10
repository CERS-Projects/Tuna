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
    @NotBlank
    @Size(min = 1, max = 20)
    private String showUserId;

    @NotBlank
    private String password;

    @NotBlank
    @Email
    @Size(min = 1, max = 254)
    private String mailAddress;

    @NotBlank
    @Size(min = 1, max = 50)
    private String name;

    /*
     * ※申請した学校に応じて@Maxの値の変更をしてください※
     * 最高学年が3年の場合 : @Max(3)
     * 最高学年が6年の場合 : @Max(6)
     */
    @NotNull
    @Min(1)
    @Max(3)
    private Integer grade;

    @NotNull
    private LocalDate admissionDate;

    /*
     * 卒業年度情報(Nullは許容)
     */
    private LocalDate graduateDate;

}
