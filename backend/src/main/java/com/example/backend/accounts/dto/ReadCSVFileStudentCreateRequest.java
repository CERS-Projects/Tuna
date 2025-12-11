package com.example.backend.accounts.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@JsonPropertyOrder({"showUserId", "password"     , "mailAddress" , "name",
                     "grade"    , "admissionDate", "graduateDate"})
public record ReadCSVFileStudentCreateRequest (
    @NotBlank
    String showUserId,

    @NotBlank
    String password,

    @NotBlank
    @Email
    String mailAddress,

    @NotBlank
    String name,

    /* 
     * ※申請した学校に応じて@Maxの値の変更をしてください※
     * 　最高学年が3年の場合 : @Max(3)
     * 　最高学年が6年の場合 : @Max(6) 
     */
    @NotNull
    @Min(1)
    @Max(3)
    Integer grade,
    
    @NotNull(message = "入学年度の入力は必須です")
    LocalDate admissionDate,

    /* 
     * 卒業年度情報(Nullは許容)
     */
    LocalDate graduateDate
){}


