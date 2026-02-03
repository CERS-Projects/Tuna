package com.example.backend.posts.repository;

import com.mongodb.client.result.UpdateResult;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class PostCounterRepository {

    private final MongoTemplate mongoTemplate;

    // +1
    public void incrementLikeCount(ObjectId postId) {
        Query query = new Query(Criteria.where("_id").is(postId));
        Update update = new Update().inc("like_count", 1);

        UpdateResult result = mongoTemplate.updateFirst(query, update, "post_collection");
        if (result.getMatchedCount() == 0) {
            throw new IllegalStateException("対象の投稿が存在しません postId=" + postId);
        }
    }

    //0未満にならないようする
    public void decrementLikeCount(ObjectId postId) {
        Query query = new Query(
            new Criteria().andOperator(
                Criteria.where("_id").is(postId),
                Criteria.where("like_count").gt(0)
            )
        );
        Update update = new Update().inc("like_count", -1);

        UpdateResult result = mongoTemplate.updateFirst(query, update, "post_collection");
        if (result.getMatchedCount() == 0) {
            // 投稿が無い or like_count が0 のどちらか
            throw new IllegalStateException("対象の投稿が存在しないか、like_countが0です postId=" + postId);
        }
    }
}
