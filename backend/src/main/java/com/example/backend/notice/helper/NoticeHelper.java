package com.example.backend.notice.helper;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Component;

import com.example.backend.notice.dto.NoticeInsertRequest;
import com.example.backend.notice.dto.NoticeListResponse;
import com.example.backend.notice.dto.NoticeModifyRequest;
import com.example.backend.notice.model.NoticeEntity;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class NoticeHelper {

    public NoticeEntity toEntity(NoticeInsertRequest dto) {
        NoticeEntity entity = new NoticeEntity();
        OffsetDateTime dateTimeNow = OffsetDateTime.now(ZoneOffset.UTC);
        entity.setGroupId(dto.getGroupId());
        entity.setTitle(dto.getTitle());
        entity.setContent(dto.getContent());
        entity.setCreatedAt(Date.from(dateTimeNow.toInstant()));
        return entity;
    }

    public NoticeEntity toEntity(NoticeModifyRequest dto, ObjectId noticeId) {
        NoticeEntity entity = new NoticeEntity();
        OffsetDateTime dateTimeNow = OffsetDateTime.now(ZoneOffset.UTC);
        entity.setNoticeId(noticeId);
        entity.setGroupId(dto.getGroupId());
        entity.setTitle(dto.getTitle());
        entity.setContent(dto.getContent());
        entity.setCreatedAt(Date.from(dateTimeNow.toInstant()));
        return entity;
    }

    public NoticeListResponse toNoticeListResponse(NoticeEntity entity) {
        NoticeListResponse response = new NoticeListResponse();
        response.setNoticeId(entity.getNoticeId().toHexString());
        response.setGroupId(entity.getGroupId());
        response.setTitle(entity.getTitle());
        response.setContent(entity.getContent());
        response.setCreatedAt(entity.getCreatedAt());    

        return response;
    }
}
