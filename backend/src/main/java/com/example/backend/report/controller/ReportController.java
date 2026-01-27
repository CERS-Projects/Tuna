package com.example.backend.report.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.report.service.ReportService;

import lombok.RequiredArgsConstructor;

@RequestMapping("/report")
@RestController
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/create")
    public ResponseEntity<Void> createReport(){
        reportService.createReport();
        return ResponseEntity.ok().build();
    }
}
