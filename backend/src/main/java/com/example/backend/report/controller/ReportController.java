package com.example.backend.report.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.report.dto.ReportDeleteRequest;
import com.example.backend.report.dto.ReportInsertRequest;
import com.example.backend.report.dto.ReportListRequest;
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
    public ResponseEntity<List<ReportListResponse>> getReportList(@Valid @ModelAttribute ReportListRequest dto){
       List<ReportListResponse> response = reportService.getReportList(dto);
       return ResponseEntity.ok().body(response);
    }

    @PostMapping("/create")
    public ResponseEntity<Void> createReport(@Valid @RequestBody ReportInsertRequest dto){
        reportService.createReport(dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteReport(@Valid @RequestBody ReportDeleteRequest dto){
        reportService.deleteReport(dto);
        return ResponseEntity.ok().build();
    }
}
