package com.example.backend.report.service;

import java.util.List;

import com.example.backend.report.dto.ReportInsertRequest;
import com.example.backend.report.dto.ReportListResponse;

public interface ReportService {
    void createReport(ReportInsertRequest dto, Integer schoolId, Integer userId);  
    List<ReportListResponse> getReportList(Integer schoolId);
    void deleteReport(String reportId, Integer userId, Integer schoolId);
} 