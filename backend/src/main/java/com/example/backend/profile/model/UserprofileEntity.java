package com.example.backend.profile.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.util.List;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "profile_collection")
public class Userprofile {

    @NotNull
    @id
    private ObjectId id;

    @NotNull
    @Field("user_id")
    private String userId;

    @NotNull
    @Field("icon")
    private String iconObjectKey;

    @NotNull
    @Field("show_user_id")
    private boolean showUserId;


    @Field("introduction")
    private String introduction;

    @NotNull
    @Field("follow_count")
    private Integer followCount;

    @NotNull
    @Field("follower_count")
    private Integer followerCount;

    @Field("filter_words")
    private List<String> filterWords;
}
