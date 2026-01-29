package com.example.backend.posts.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchPostsRequest {
    
    @NotNull
    private String keyword;

    @NotNull
    private List<Integer> shareRange;

    //ダミー項目
    @NotNull
    private Integer currentUserId;
    

    private List<String> muteWords;
}
