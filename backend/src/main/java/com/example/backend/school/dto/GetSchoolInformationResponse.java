package com.example.backend.school.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetSchoolInformationResponse {
    private String schoolName;
    private String schoolAddress;
    private String schoolMailAddress;
}
