package com.example.backend.posts.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import jakarta.validation.constraints.NotNull;


@Getter
@Setter
@Document(collection = "like_collection")
public class LikeEntity {

    @Id
    private String id;

    @NotNull
    @Field("post_id")
    private Integer postId;


    @NotNull
    @Field("user_id")
    private Integer userId;

    @NotNull
    @Field("liked_at")
    private String likedAt;

}
