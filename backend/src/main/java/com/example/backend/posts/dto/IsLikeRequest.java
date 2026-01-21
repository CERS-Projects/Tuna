package com.example.backend.posts.dto;

import jakarta.validation.constraints.NotNull;
import org.bson.types.ObjectId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IsLikeRequest {

    @NotNull
    Integer userId;

    @NotNull
    ObjectId postId;
    
}
