package com.example.backend.accounts.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModifyStudentAccountRequest {
    @NotNull
    private Integer userId;

    @NotBlank
    @Size(min = 1, max = 50)
    private String name;

    @Email
    @Size(min = 1, max = 254)
    @NotBlank
    private String mailAddress;

    @NotNull
    private LocalDate graduateDate;

    @NotNull
    private Boolean accountStopFlag;
}
