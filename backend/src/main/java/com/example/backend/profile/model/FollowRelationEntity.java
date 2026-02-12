package com.example.backend.profile.model;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.bson.types.ObjectId;

import java.util.Date;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Document(collection = "follow_and_follower_collection")
@CompoundIndexes({
    @CompoundIndex(name = "follower_following_unique", def = "{'follower_id': 1, 'following_id': 1}", unique = true),
    @CompoundIndex(name = "follower_id_idx", def = "{'follower_id': 1}")
})
public class FollowRelationEntity {

    @Id
    private ObjectId id; 

    @Field("follower_id")
    private Integer followerId;   // フォローしている側（自分）
    
    @Field("following_id")
    private Integer followingId;  // フォローされる側（相手）

    @Field("created_at")
    private Date createdAt;
}
