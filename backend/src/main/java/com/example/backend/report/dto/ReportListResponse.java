package com.example.backend.report.dto;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportListResponse {
    private String reportId;
    private String reportedName;
    private String reportedShowUserId;
    private Integer reasonId;
    private Date reportDate;
    private String reportedPost;
    private String reportDetail;
}
