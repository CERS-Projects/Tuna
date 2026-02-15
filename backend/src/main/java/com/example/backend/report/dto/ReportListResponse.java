package com.example.backend.report.dto;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportListResponse {
    private String reportId;
    // 通報された人
    private String reportedName;
    private String reportedShowUserId;
    // 通報者
    private String reportByName;
    private String reportByShowUserId;
    private Integer reasonId;
    private Date reportDate;
    private String reportedPost;
    private Date reportedPostDate;
    private String reportDetail;
}
