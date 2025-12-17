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
    @NotBlank
    @Size(min = 1,max = 256)
    private String schoolName;

    @NotBlank
    @Size(min = 13, max = 13)
    private String schoolCode;

    @NotBlank
    @Size(min = 1, max = 161)
    private String schoolAddress;

    @NotBlank
    @Size(min =  1, max = 32)
    private String schoolMailAddress;
}

