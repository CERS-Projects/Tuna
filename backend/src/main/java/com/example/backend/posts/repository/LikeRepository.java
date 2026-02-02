package com.example.backend.posts.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.backend.posts.dto.PostDetailResponse;
import java.util.List;

import org.springframework.stereotype.Repository;
import com.example.backend.posts.model.LikeEntity;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.Aggregation;

@Repository 
public interface LikeRepository extends MongoRepository<LikeEntity, String> {
        
        // ユーザーIDと投稿IDでいいねの存在を確認
        boolean existsByPostIdAndUserId(ObjectId postId, Integer userId);

        // ユーザーIDと投稿IDでいいねを削除
        void deleteByPostIdAndUserId(ObjectId postId, Integer userId);

        // 投稿idでいいねを削除
        void deleteByPostId(ObjectId postId);


        // ユーザーIDでいいねした投稿を取得
        @Aggregation(pipeline = {
                //1. ユーザーがいいねした投稿を取得
                "{ $match: { user_id: ?0 } }",
                
                //2. 新しい順にソートして上位50件を取得
                "{ $sort: { liked_at: -1 } }",
                "{ $limit: 50 }",
                
                //3. post_collection join
                "{ $lookup: { " +
                        "from: 'post_collection', " +
                        "localField: 'post_id', " +
                        "foreignField: '_id', " +
                        "as: 'post' " +
                "} }",
                "{ $unwind: '$post' }",

                //4. post_flag が true の投稿だけfilter
                "{ $match: { 'post.post_flag': { $ne: false } } }",

                //5. profile_collection join
                "{ $lookup: { " +
                        "from: 'profile_collection', " +
                        "localField: 'post.user_id', " +
                        "foreignField: 'user_id', " +
                        "as: 'profile' " +
                "} }",
                "{ $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } }",

                //6. like join
                "{ $lookup: { " +
                "from: 'like_collection', " +
                "let: { pid: '$post._id', uid: ?0 }, " +
                "pipeline: [ { $match: { $expr: { $and: [" +
                "  { $eq: ['$post_id', '$$pid'] }, " +
                "  { $eq: ['$user_id', '$$uid'] } " +
                "] } } } ], " +
                "as: 'likes' } }",
                
                //7. ユーザーがブックマークしているかどうかを結合
                "{ $lookup: { " +
                "from: 'bookmark_collection', " +
                "let: { pid: '$post._id', uid: ?0 }, " +
                "pipeline: [ { $match: { $expr: { $and: [" +
                "  { $eq: ['$post_id', '$$pid'] }, " +
                "  { $eq: ['$user_id', '$$uid'] } " +
                "] } } } ], " +
                "as: 'bookmarks' } }",

                //8. 必要な情報を整理
                "{ $project: { " +
                "  _id: { $toString: '$post._id' }, " +
                "  user_id: '$post.user_id', " +
                "  sentence: '$post.sentence', " +
                "  imageUrl: '$post.image_objectKey', " +
                "  share_range: '$post.share_range', " +
                "  post_date: '$post.post_date', " +
                "  like_count: '$post.like_count', " +
                "  response_count: '$post.response_count', " +
                "  nickname: '$profile.nickname', " +
                "  show_user_id: '$profile.show_user_id', " +
                "  icon: '$profile.icon', " +
                "  isLiked: { $gt: [ { $size: '$likes' }, 0 ] }, " +
                "  isBookmarked: { $gt: [ { $size: '$bookmarks' }, 0 ] } " +
                "} }"
                })
                List<PostDetailResponse> findByLiked(Integer userId);


}
