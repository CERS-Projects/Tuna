package com.example.backend.posts.dto;

import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotNull;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;
import java.util.Date;

@Getter
@Setter
public class PostDetailDto {
    //postから取得

    private String postId;

    @Field("user_id")
    private Integer userId;

    @Field("sentence")
    private String sentence;

    @Field("image_url")
    private List<String> imageUrl;

    @Field("post_date")
    private Date postDate;

    @Field("like_Count")
    private Integer likeCount;

    //profileから取得
    private String nickname;
    private String showUserId;
    private String icon;

    //その他から取得、計算
    private Integer responseCount;
    private Boolean isLiked;
    private Boolean isBookmarked;
}
