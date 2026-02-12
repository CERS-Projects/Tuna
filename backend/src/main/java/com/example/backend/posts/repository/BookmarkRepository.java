package com.example.backend.posts.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.posts.dto.PostDetailResponse;
import com.example.backend.posts.model.BookmarkEntity;
import org.bson.types.ObjectId;
import java.util.List;
import org.springframework.data.mongodb.repository.Aggregation;

@Repository
public interface BookmarkRepository extends MongoRepository<BookmarkEntity, ObjectId> {

        // ユーザーIDと投稿IDでブックマークの存在を確認
        boolean existsByUserIdAndPostId(Integer userId, ObjectId postId);

        // ユーザーIDと投稿IDでブックマークを削除
        void deleteByUserIdAndPostId(Integer userId, ObjectId postId);

        // 投稿idでブックマークを削除
        void deleteByPostId(ObjectId postId);

        // ユーザーIDでブックマークされた投稿を取得
        @Aggregation(pipeline = {
                        // 1. UserIdでfilter
                        "{ $match: { user_id: ?0 } }",

                        // 1.5 50件まで取得
                        "{ $sort: { bookmarked_at: -1 } }",
                        "{ $limit: 50 }",

                        // 2. 投稿collectionと結合（bookmark.post_id -> post._id）
                        "{ $lookup: { " +
                                        "from: 'post_collection', " +
                                        "localField: 'post_id', " +
                                        "foreignField: '_id', " +
                                        "as: 'post' " +
                                        "} }",
                        "{ $unwind: '$post' }",

                        // 3.post_flag が true の投稿だけfilter
                        "{ $match: { 'post.post_flag': { $ne: false } } }",

                        // 4. プロフィール情報と結合 （post.user_id -> profile.user_id）
                        "{ $lookup: { " +
                                        "from: 'profile_collection', " +
                                        "localField: 'post.user_id', " +
                                        "foreignField: 'user_id', " +
                                        "as: 'profile' " +
                                        "} }",
                        "{ $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } }",

                        // 5. like join（like_collection に post_id & user_id がある前提）
                        "{ $lookup: { " +
                                        "from: 'like_collection', " +
                                        "let: { pid: '$post._id', uid: ?0 }, " +
                                        "pipeline: [ " +
                                        "  { $match: { $expr: { $and: [ " +
                                        "    { $eq: ['$post_id', '$$pid'] }, " +
                                        "    { $eq: ['$user_id', '$$uid'] } " +
                                        "  ] } } } " +
                                        "], " +
                                        "as: 'likes' " +
                                        "} }",

                        // 6. 念のため bookmarkを確認
                        "{ $lookup: { " +
                                        "from: 'bookmark_collection', " +
                                        "let: { pid: '$post._id', uid: ?0 }, " +
                                        "pipeline: [ " +
                                        "  { $match: { $expr: { $and: [ " +
                                        "    { $eq: ['$post_id', '$$pid'] }, " +
                                        "    { $eq: ['$user_id', '$$uid'] } " +
                                        "  ] } } } " +
                                        "], " +
                                        "as: 'bookmarks' " +
                                        "} }",

                        // 7. 必要なフィールドだけ出す
                        "{ $project: { " +
                                        "  _id: { $toString: '$post._id' }, " +
                                        "  user_id: '$post.user_id', " +
                                        "  sentence: '$post.sentence', " +
                                        "  imageUrl: '$post.image_objectKey', " +
                                        "  share_range: '$post.share_range', " +
                                        "  post_date: '$post.post_date', " +
                                        "  like_count: '$post.like_count', " +
                                        "  nickname: '$profile.nickname', " +
                                        "  show_user_id: '$profile.show_user_id', " +
                                        "  icon: '$profile.icon', " +
                                        "  response_count: '$post.response_count', " +
                                        "  isLiked: { $gt: [ { $size: '$likes' }, 0 ] }, " +
                                        "  isBookmarked: { $gt: [ { $size: '$bookmarks' }, 0 ] } " +
                                        "} }"

        })
        List<PostDetailResponse> findByBookmarked(Integer userId);
}
