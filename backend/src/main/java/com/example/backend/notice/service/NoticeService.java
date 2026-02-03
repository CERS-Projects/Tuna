package com.example.backend.notice.service;

import java.util.List;

import com.example.backend.notice.dto.NoticeInsertRequest;
import com.example.backend.notice.dto.NoticeListResponse;
import com.example.backend.notice.dto.NoticeModifyRequest;

public interface NoticeService {
    void createNotice(NoticeInsertRequest dto, Integer schoolId);
    List<NoticeListResponse> getNoticeListFromStudent(Integer userId, Integer schoolId);
    List<NoticeListResponse> getNoticeListFromTeacher(Integer schoolId);
    void modifyNotice(NoticeModifyRequest dto, Integer schoolId);
    void deleteNotice(String noticeId, Integer userId, Integer schoolId);
}
