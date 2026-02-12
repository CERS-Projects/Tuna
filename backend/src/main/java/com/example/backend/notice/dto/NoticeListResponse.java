package com.example.backend.notice.dto;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoticeListResponse {
    private String noticeId;
    private Integer groupId;
    private String groupName;
    private String title;
    private String content;
    private Date createdAt;
}
