package com.example.backend.posts.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.bson.types.ObjectId;
import java.util.Date;


@Getter
@Setter
@Document(collection = "like_collection")
public class LikeEntity {

    @Id
    @MongoId(FieldType.OBJECT_ID)
    private ObjectId id;

    
    @NotNull
    @Field(value = "post_id", targetType = FieldType.OBJECT_ID)
    private ObjectId postId;


    @NotNull
    @Field("user_id")
    private Integer userId;


    @NotNull
    @Field("liked_at")
    private Date likedAt;

}
