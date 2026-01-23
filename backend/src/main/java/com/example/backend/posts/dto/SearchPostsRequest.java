package com.example.backend.posts.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchPostsRequest {
    
    @NotNull
    private String keyword;

    @NotNull
    private Integer currentUserId;
}
