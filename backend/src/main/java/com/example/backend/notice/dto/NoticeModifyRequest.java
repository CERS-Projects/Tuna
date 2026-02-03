package com.example.backend.notice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class NoticeModifyRequest {
    @NotBlank
    private String noticeId;

    @NotNull
    private Integer groupId;
    
    @NotBlank
    private String title;

    @NotBlank
    private String content;
}
