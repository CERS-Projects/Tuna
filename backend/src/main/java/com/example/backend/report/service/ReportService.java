package com.example.backend.report.service;

import java.util.List;

import com.example.backend.report.dto.ReportDeleteRequest;
import com.example.backend.report.dto.ReportInsertRequest;
import com.example.backend.report.dto.ReportListRequest;
import com.example.backend.report.dto.ReportListResponse;

public interface ReportService {
    void createReport(ReportInsertRequest dto);  
    List<ReportListResponse> getReportList(ReportListRequest dto);
    void deleteReport(ReportDeleteRequest dto);
} 