package com.example.backend.profile.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "profile_collection")
public class UserProfileEntity {

    @Id
    private ObjectId id;

    @Field("user_id")
    private Integer userId;

    @Field("nickname")
    private String nickname;

    @Field("icon")
    private String iconObjectKey;

    @Field("show_user_id")
    private String showUserId;

    @Field("introduction")
    private String introduction;

    @Field("follow")
    private Integer followCount;

    @Field("follower")
    private Integer followerCount;

    @Field("filtering")
    private List<String> filterWords;
}
