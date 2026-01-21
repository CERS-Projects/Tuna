package com.example.backend.posts.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;
import org.bson.types.ObjectId;

@Getter
@Setter
public class IsBookmarkRequest {

    @NotNull   
    Integer  userId;

    @NotNull
    ObjectId postId;

}
