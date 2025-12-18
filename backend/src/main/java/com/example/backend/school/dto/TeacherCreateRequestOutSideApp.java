package com.example.backend.school.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/*
 * 教師アカウント登録のためのDto
 */

@Setter
@Getter
public class TeacherCreateRequestOutSideApp {
    @NotBlank
    @Size(min = 1, max = 20)
    private String showUserId;

    @NotBlank
    @Size(min = 1, max = 20)
    private String name;

    @NotBlank
    @Email
    @Size(min = 1, max = 254)
    private String mailAddress;
    
    @NotBlank
    private String password;
}
