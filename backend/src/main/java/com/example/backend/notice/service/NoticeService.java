package com.example.backend.notice.service;

import java.util.List;

import com.example.backend.notice.dto.NoticeInsertRequest;
import com.example.backend.notice.dto.NoticeListResponse;

public interface NoticeService {
    void createNotice(NoticeInsertRequest dto);
    List<NoticeListResponse> getNoticeListFromStudent(Integer userId, Integer schoolId);
    List<NoticeListResponse> getNoticeListFromTeacher(Integer schoolId);
}
