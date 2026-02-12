package com.example.backend.school.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModifySchoolInformationRequest {

    @NotBlank
    @Size(min = 1, max = 256)
    private String schoolName;

    @NotBlank
    @Size(min = 1, max = 161)
    private String schoolAddress;

    @NotBlank
    @Size(min = 1, max = 254)
    @Email
    private String schoolMailAddress;
}
