package com.example.backend.notice.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.notice.dto.NoticeInsertRequest;
import com.example.backend.notice.helper.NoticeHelper;
import com.example.backend.notice.repository.NoticeRepository;
import com.example.backend.notice.service.NoticeService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class NoticeServiceImpl implements NoticeService {

    private final NoticeRepository noticeRepository;

    private final NoticeHelper noticeHelper;

    @Override
    @Transactional
    public void createNotice(NoticeInsertRequest dto) {
         noticeRepository.save(noticeHelper.toEntity(dto));
    }
    
}
