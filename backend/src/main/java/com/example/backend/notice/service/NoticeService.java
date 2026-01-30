package com.example.backend.notice.service;

import com.example.backend.notice.dto.NoticeInsertRequest;

public interface NoticeService {
    void createNotice(NoticeInsertRequest dto);
}
