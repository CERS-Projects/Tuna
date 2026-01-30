package com.example.backend.notice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.notice.dto.NoticeListRequest;
import com.example.backend.notice.dto.NoticeInsertRequest;
import com.example.backend.notice.dto.NoticeListResponse;
import com.example.backend.notice.service.NoticeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RequestMapping("/notice")
@RestController
public class NoticeController {

    private final NoticeService noticeService;

    @PostMapping("/create")
    public ResponseEntity<Void> createNotice(@Valid @RequestBody NoticeInsertRequest dto) {
        noticeService.createNotice(dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/list")
    public ResponseEntity<List<NoticeListResponse>> getNoticeList(@Valid @ModelAttribute NoticeListRequest dto) {
        // Implementation to list notices will go here
        return ResponseEntity.ok().build();
    }
}