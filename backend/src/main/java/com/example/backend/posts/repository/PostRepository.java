package com.example.backend.posts.repository;



import com.example.backend.posts.dto.PostDetailDto;
import com.example.backend.posts.model.PostEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.Aggregation;
import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<PostEntity, String> {


    // ユーザーIDと投稿IDで存在確認(ユーザーチェック)
    boolean existsByIdAndUserId(String id, Integer userId);

    //投稿を削除
    void deleteByIdAndUserId(String id, Integer userId);

    //タイムライン投稿取得
        @Aggregation(pipeline = {
        // 1. response_toがnullのドキュメントのみをフィルタ
        "{ $match: { response_to: null } }",
        
        // 2. share_rangeの条件でフィルタ
        "{ $match: { share_range: { $in: ?1 } } }",
        
        // 3. muteWordの条件でフィルタ
        "{ $match: { " +
        "  $expr: { " +
        "    $cond: { " +
        "      if: { $and: [ { $ne: [?2, null] }, { $gt: [{ $size: { $ifNull: [?2, []] } }, 0] } ] }, " +
        "      then: { $not: { $anyElementTrue: { $map: { input: ?2, as: 'word', in: { $regexMatch: { input: '$sentence', regex: '$$word' } } } } } }, " +
        "      else: true " +
        "    } " +
        "  } " +
        "} }",
        
        // 4. profile_collectionとuser_idで結合
        "{ $lookup: { " +
        "  from: 'profile_collection', " +
        "  localField: 'user_id', " +
        "  foreignField: 'user_id', " +
        "  as: 'profile' " +
        "} }",
        
        // 5. profileを展開（preserveNullAndEmptyArraysをtrueに）
        "{ $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } }",
        
        // 6. response_countを計算
        "{ $lookup: { " +
        "  from: 'post_collection', " +
        "  let: { postId: '$_id' }, " +
        "  pipeline: [ " +
        "    { $match: { $expr: { $eq: ['$response_to', '$$postId'] } } }, " +
        "    { $count: 'count' } " +
        "  ], " +
        "  as: 'responses' " +
        "} }",
        
        // 7. like_collectionから検索
        "{ $lookup: { " +
        "  from: 'like_collection', " +
        "  let: { postId: '$_id' }, " +
        "  pipeline: [ " +
        "    { $match: { " +
        "      $expr: { " +
        "        $and: [ " +
        "          { $eq: ['$user_id', ?0] }, " +
        "          { $eq: ['$post_id', '$$postId'] } " +
        "        ] " +
        "      } " +
        "    } } " +
        "  ], " +
        "  as: 'likes' " +
        "} }",
        
        // 8. bookmark_collectionから検索
        "{ $lookup: { " +
        "  from: 'bookmark_collection', " +
        "  let: { postId: '$_id' }, " +
        "  pipeline: [ " +
        "    { $match: { " +
        "      $expr: { " +
        "        $and: [ " +
        "          { $eq: ['$user_id', ?0] }, " +
        "          { $eq: ['$post_id', '$$postId'] } " +
        "        ] " +
        "      } " +
        "    } } " +
        "  ], " +
        "  as: 'bookmarks' " +
        "} }",
        
        // 9. 最終的なフィールドを整形
        "{ $project: { " +
        "  _id: 0, " +
        "  postId: { $toString: '$_id' }, " +
        "  userId: '$user_id', " +
        "  sentence: '$sentence', " +
        "  imageUrl: '$image_objectKey', " +
        "  postDate: '$post_date', " +
        "  likeCount: '$like_Count', " +
        "  nickname: '$profile.nickname', " +
        "  showUserId: '$profile.show_user_id', " +
        "  icon: '$profile.icon', " +
        "  responseCount: { $ifNull: [{ $arrayElemAt: ['$responses.count', 0] }, 0] }, " +
        "  isLiked: { $gt: [{ $size: '$likes' }, 0] }, " +
        "  isBookmarked: { $gt: [{ $size: '$bookmarks' }, 0] } " +
        "} }",

        // 10. ソート：postDate降順
        "{ $sort: { postDate: -1 } }",
    
        // 11. 50件に制限
        "{ $limit: 50 }"
    })
    List<PostDetailDto> findPostsWithDetails(
        Integer currentUserId,
        List<Integer> shareRangeList,
        List<String> muteWords
    );
}

