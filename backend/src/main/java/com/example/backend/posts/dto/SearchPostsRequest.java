package com.example.backend.posts.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchPostsRequest {
    
    @NotNull
    @Size(max = 100, message = "keyword は最大100文字までです")
    private String keyword;

    @NotNull
    private List<Integer> shareRange;

    //jwtから取得予定
    @NotNull
    private Integer currentUserId;
    
    //profilecolectionからの取得予定
    private List<String> muteWords;
}
