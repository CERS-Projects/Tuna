package com.example.backend.report.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportInsertRequest {

    @NotNull
    private Integer schoolId;

    @NotNull
    private Integer reportBy;

    @NotNull
    private Integer reportedUser;

    @NotNull
    private Integer reasonId;

    @NotBlank
    private String detail;

    @NotBlank
    private String reportedPostId;

}
