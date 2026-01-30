package com.example.backend.posts.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import jakarta.validation.constraints.NotNull;
import org.bson.types.ObjectId;
import java.util.Date;

@NoArgsConstructor
@Getter
@Setter
@Document(collection = "bookmark_collection")
public class BookmarkEntity {

    @Id
    private ObjectId id;

    @NotNull
    @Field("post_id")
    private ObjectId postId;

    @NotNull
    @Field("user_id")
    private Integer userId;
    
    @NotNull
    @Field("bookmarked_at")
    private Date bookmarkedAt;
}
