package com.example.backend.report.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.auth.dto.UserInfo;
import com.example.backend.report.dto.ReportInsertRequest;
import com.example.backend.report.dto.ReportListResponse;
import com.example.backend.report.service.ReportService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequestMapping("/report")
@RestController
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/list")
    public ResponseEntity<List<ReportListResponse>> getReportList(@AuthenticationPrincipal UserInfo userInfo){
       
        List<ReportListResponse> response = reportService.getReportList(userInfo.getSchoolId());
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/create")
    public ResponseEntity<Void> createReport(@Valid @RequestBody ReportInsertRequest dto, 
                                             @AuthenticationPrincipal UserInfo userInfo){
        
        reportService.createReport(dto, userInfo.getSchoolId(), userInfo.getUserId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteReport(@RequestParam String reportId,
                                             @AuthenticationPrincipal UserInfo userInfo){

        reportService.deleteReport(reportId, userInfo.getUserId(), userInfo.getSchoolId());
        return ResponseEntity.ok().build();
    }
}
