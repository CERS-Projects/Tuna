package com.example.backend.posts.model;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "post_collection")
public class PostEntity {
    

    @Id
    private ObjectId id;
    
    @Field("user_id")
    @NotNull
    private Integer userId;
    
    @Field("post_date")
    @NotNull
    private Date postDate;
    
    @Field("sentence")
    @NotNull
    private String sentence;
    
    @Field("image_objectKey")
    private List<String> imageObjectKey;
    
    @Field("like_count")
    @NotNull
    private Integer likeCount;

    @Field("response_count")
    @NotNull
    private Integer responseCount;
    
    @Field("share_range")
    @NotNull
    private List<Integer> shareRange;
    
    @Field("post_flag")
    @NotNull
    private Boolean postFlag;

    @Field("response_to")
    private ObjectId responseTo;
}