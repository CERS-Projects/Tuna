package com.example.backend.posts.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import jakarta.validation.constraints.NotNull;


@NoArgsConstructor
@Getter
@Setter
@Document(collection = "bookmark_collection")
public class BookmarkEntity {

    @Id
    private String id;

    @NotNull
    @Field("post_id")
    private Integer postId;

    @NotNull
    @Field("user_id")
    private Integer userId;
    
    @NotNull
    @Field("bookmarked_at")
    private String bookmarkedAt;
}
