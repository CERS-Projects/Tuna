package com.example.backend.school.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ModifySchoolInformationResponse {
    private String schoolName;
    private String schoolAddress;
    private String schoolMailAddress;
}
