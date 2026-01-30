package com.example.backend.notice.model;

import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "notice_collection")
public class NoticeEntity {
    @Id
    private ObjectId noticeId;

    @Field("group_id")
    @NotNull
    private Integer groupId;

    @Field("title")
    @NotNull
    private String title;

    @Field("content")
    @NotNull
    private String content;

    @Field("created_at")
    @NotNull
    private Date createdAt;
}
