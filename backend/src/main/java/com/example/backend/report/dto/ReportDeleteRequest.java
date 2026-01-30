package com.example.backend.report.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportDeleteRequest {
    @NotBlank
    private String reportId;
}
