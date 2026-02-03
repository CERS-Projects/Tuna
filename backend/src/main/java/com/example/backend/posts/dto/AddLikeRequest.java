package com.example.backend.posts.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public class AddLikeRequest {

    @NotNull
    private String postId;

}
