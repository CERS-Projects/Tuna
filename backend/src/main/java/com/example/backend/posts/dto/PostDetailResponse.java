package com.example.backend.posts.dto;

import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;
import java.util.Date;

@Getter
@Setter
public class PostDetailResponse {
    //postから取得
    @NotNull
    @Size(min = 24, max = 24)
    @Field("_id")
    private String postId;

    //Jwtから取得予定
    @Field("user_id")
    private Integer userId;

    @NotNull
    @Size(min = 1, max = 255, message = "sentence は1-255文字以内である必要があります")
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
    @Field("like_count")
    private Integer likeCount;

    @NotNull
    @Field("response_count")
    private Integer responseCount;

    //profileから取得
    @NotNull
    @Size(min = 1, max = 20, message = "nickname は1-20文字以内である必要があります")
    @Field("nickname")
    private String nickname;

    @NotNull
    @Size(min = 1, max = 20, message = "showUserId は1-20文字以内である必要があります")
    @Field("show_user_id")
    private String showUserId;

    @NotNull
    private String icon;

    //その他から取得、計算
    
    private Boolean isLiked;
    private Boolean isBookmarked;
}
