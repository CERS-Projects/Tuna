package com.example.backend.posts.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.bson.types.ObjectId;

@Getter
@Setter
public class IsBookmarkRequest {

    //Jwtから取得
    Integer  userId;

    @NotNull
    @Size(min = 24, max = 24, message = "postId は24文字である必要があります")
    ObjectId postId;

}
