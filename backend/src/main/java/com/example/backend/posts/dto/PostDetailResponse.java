package com.example.backend.posts.dto;

import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotNull;
import org.springframework.data.mongodb.core.mapping.Field;
import org.bson.types.ObjectId;

import java.util.List;
import java.util.Date;

@Getter
@Setter

public class PostDetailResponse {
    //postから取得
    @NotNull
    @Field("_id")
    private ObjectId postId;

    @NotNull
    @Field("user_id")
    private Integer userId;

    @NotNull
    @Field("sentence")
    private String sentence;

    private List<String> imageUrl;

    @NotNull
    @Field("share_range")
    private List<Integer> shareRange;

    @NotNull
    @Field("post_date")
    private Date postDate;

    @NotNull
    @Field("like_Count")
    private Integer likeCount;

    @NotNull
    @Field("response_Count")
    private Integer responseCount;

    //profileから取得
    @NotNull
    private String nickname;

    @NotNull
    private String showUserId;

    @NotNull
    private String icon;

    //その他から取得、計算
    
    private Boolean isLiked;
    private Boolean isBookmarked;
}
