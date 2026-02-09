package com.example.backend.accounts.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeacherCreateRequestInApp {
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
