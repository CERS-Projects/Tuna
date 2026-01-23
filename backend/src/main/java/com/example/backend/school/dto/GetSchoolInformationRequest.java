package com.example.backend.school.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetSchoolInformationRequest {
    @NotNull
    private Integer schoolId;
}
