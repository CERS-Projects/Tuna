package com.example.backend.notice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoticeInsertRequest {

    @NotNull
    private Integer groupId;

    @NotBlank
    private String title;

    @NotBlank
    private String content;
}
