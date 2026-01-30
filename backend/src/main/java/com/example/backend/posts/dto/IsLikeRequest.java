package com.example.backend.posts.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.bson.types.ObjectId;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IsLikeRequest {

    //Jwtから取得予定
    Integer userId;

    @NotNull
    @Size(min = 24, max = 24, message = "postId は24文字である必要があります")
    ObjectId postId;
    
}
