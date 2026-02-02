package com.example.backend.notice.controller;

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
import com.example.backend.notice.dto.NoticeInsertRequest;
import com.example.backend.notice.dto.NoticeListResponse;
import com.example.backend.notice.dto.NoticeModifyRequest;
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

    @GetMapping("/teacher/list")
    public ResponseEntity<List<NoticeListResponse>> getNoticeListFromTeacher(@AuthenticationPrincipal UserInfo userInfo) {
        List<NoticeListResponse> notices = noticeService.getNoticeListFromTeacher(userInfo.getSchoolId());
        return ResponseEntity.ok(notices);
    }

    @GetMapping("/list")
    public ResponseEntity<List<NoticeListResponse>> getNoticeListFromStudent(@AuthenticationPrincipal UserInfo userInfo) {
        List<NoticeListResponse> notices = noticeService.getNoticeListFromStudent(userInfo.getUserId(), userInfo.getSchoolId());
        return ResponseEntity.ok(notices);
    }

    @PostMapping("/modify")
    public ResponseEntity<Void> modifyNotice(@Valid @RequestBody NoticeModifyRequest dto){
        noticeService.modifyNotice(dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteNotice(@RequestParam String noticeId){
        noticeService.deleteNotice(noticeId);
        return ResponseEntity.ok().build();
    }
}