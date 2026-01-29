package com.example.backend.report.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportListRequest {
    @NotNull
    private Integer schoolId;
}
