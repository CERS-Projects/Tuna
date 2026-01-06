package com.example.backend.posts.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.backend.posts.model.LikeEntity;
import com.example.backend.posts.model.PostEntity;
import org.springframework.data.mongodb.repository.Aggregation;

@Repository 
public interface LikeRepository extends MongoRepository<LikeEntity, String> {

    boolean existsByPostIdAndUserId(String post, Integer userId);

    void deleteByPostIdAndUserId(String post, Integer userId);

    @Aggregation(pipeline = {
        "{ $match: { post_id: ?0 } }",
        "{ $count: 'likeCount' }"
    })
    Integer countLikesByPostId(String postId);

}
