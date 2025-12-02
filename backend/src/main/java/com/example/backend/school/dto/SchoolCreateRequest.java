package com.example.backend.school.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/*
 * 学校情報を登録するためのDto
 */

@Setter
@Getter
public class SchoolCreateRequest {
    @NotBlank(message = "学校名の入力は必須です")
    @Size(min = 1,max = 256, message = "学校名は256文字以下で入力してください")
    private String schoolName;

    @NotBlank(message = "学校コードの入力は必須です")
    @Size(min = 13, max = 13, message = "学校コードは13文字固定です")
    private String schoolCode;

    @NotBlank(message = "住所の入力は必須です")
    @Size(min = 1, max = 161, message = "学校の住所は161文字以下で入力してください")
    private String schoolAddress;

    @NotBlank(message = "学校のメールアドレスは必須です")
    @Size(min =  1, max = 32, message = "学校のメールアドレスは32文字以下で入力してください")
    private String schoolMailAddress;
}

