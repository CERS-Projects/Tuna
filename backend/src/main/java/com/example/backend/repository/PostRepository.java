package com.example.backend.posts.repository;



import com.example.backend.posts.dto.PostDetailResponse;
import com.example.backend.posts.model.PostEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.bson.types.ObjectId;
import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<PostEntity, String> {

    //返信Countをインクリメント
    @Query("{ '_id': ?0 }")
    @Update("{ '$inc': { 'response_Count': 2 } }")
    long incrementResponseCount(ObjectId postId);

    
    // ユーザーIDと投稿IDで存在確認(ユーザーチェック)
    boolean existsByIdAndUserId(String id, Integer userId);

    //投稿を削除
    void deleteByIdAndUserId(String id, Integer userId);

    //タイムライン投稿取得
        @Aggregation(pipeline = {
        // 1. response_toがnullのドキュメントのみをフィルタ
        "{ $match: { response_to: null } }",
        
        // 2. share_rangeの条件でフィルタ
        "{ $match: { $expr: { $gt: [ { $size: { $setIntersection: [ '$share_range', ?1 ] } }, 0 ] } } }",

        //3.5 post_flagがfalseのものを除外
        "{ $match: { post_flag: { $ne: false } } }",
        
        // 4. ミュートワードフィルタ
        "{ $match: { " +
        "  $expr: { " +
        "    $cond: { " +
        "      if: { $and: [ { $ne: [?2, null] }, { $gt: [{ $size: { $ifNull: [?2, []] } }, 0] } ] }, " +
        "      then: { $not: { $anyElementTrue: { $map: { input: ?2, as: 'word', in: { $regexMatch: { input: '$sentence', regex: '$$word', options: 'i' } } } } } }, " +
        "      else: true " +
        "    } " +
        "  } " +
        "} }",
    
        // 5. ソート＆制限
        "{ $sort: { post_date: -1 } }",
        "{ $limit: 50 }",
        
        // 6. profile_collectionとuser_idで結合
        "{ $lookup: { " +
        "  from: 'profile_collection', " +
        "  localField: 'user_id', " +
        "  foreignField: 'user_id', " +
        "  as: 'profile' " +
        "} }",
        
        // 7. profileを展開（preserveNullAndEmptyArraysをtrueに）
        "{ $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } }",
        
        // 9. like_collectionから検索
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
        
        // 10. bookmark_collectionから検索
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
        
        // 11. 最終的なフィールドを整形
        "{ $project: { " +
        "  _id: 1, " +
        "  postId: '$_id' , " +
        "  userId: '$user_id', " +
        "  sentence: '$sentence', " +
        "  imageUrl: '$image_objectKey', " +
        "  shareRange: '$share_range', " +
        "  postDate: '$post_date', " +
        "  likeCount: '$like_Count', " +
        "  nickname: '$profile.nickname', " +
        "  showUserId: '$profile.show_user_id', " +
        "  icon: '$profile.icon', " +
        "  responseCount: '$response_Count', " +
        "  isLiked: { $gt: [{ $size: '$likes' }, 0] }, " +
        "  isBookmarked: { $gt: [{ $size: '$bookmarks' }, 0] } " +
        "} }",
    })
    List<PostDetailResponse> findPostsWithDetails(
        Integer currentUserId,
        List<Integer> shareRangeList,
        List<String> muteWords
    );

    //ユーザー投稿取得
        @Aggregation(pipeline = {
        // 1. response_toがnullのドキュメントのみをフィルタ
        "{ $match: { response_to: null } }",
        
        // 2. user_idでフィルタ
        "{ $match: { user_id: ?1 } }",

        // 3 .ユーザーのshare_rangeリストでフィルタ
        "{ $match: { $expr: { $gt: [ { $size: { $setIntersection: [ '$share_range', ?2 ] } }, 0 ] } } }",


        //3.5 post_flagがfalseのものを除外
        "{ $match: { post_flag: { $ne: false } } }",
        
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
        
        // 9. bookmark_collectionから検索
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
        
        // 11. 最終的なフィールドを整形
        "{ $project: { " +
        "  _id: 1, " +
        "  postId: '$_id', " +
        "  userId: '$user_id', " +
        "  sentence: '$sentence', " +
        "  imageUrl: '$image_objectKey', " +
        "  shareRange: '$share_range', " +
        "  postDate: '$post_date', " +
        "  likeCount: '$like_Count', " +
        "  nickname: '$profile.nickname', " +
        "  showUserId: '$profile.show_user_id', " +
        "  icon: '$profile.icon', " +
        "  responseCount: '$response_Count', " +
        "  isLiked: { $gt: [{ $size: '$likes' }, 0] }, " +
        "  isBookmarked: { $gt: [{ $size: '$bookmarks' }, 0] } " +
        "} }",
    })
    List<PostDetailResponse> findUserPostsWithDetails(
        Integer currentUserId,
        Integer targetUserId,
        List<Integer> shareRangeList
    );

    //投稿返信取得
        @Aggregation(pipeline = {
        // 1. response_toが指定したpostIdのドキュメントをフィルタ
        "{ $match: { response_to:  ?1 }  }",

        // 2 .ユーザーのmuteWordsリストでフィルタ
        "{ $match: { " +
        "  $expr: { " +
        "    $cond: { " +
        "      if: { $and: [ { $ne: [?2, null] }, { $gt: [{ $size: { $ifNull: [?2, []] } }, 0] } ] }, " +
        "      then: { $not: { $anyElementTrue: { $map: { input: ?2, as: 'word', in: { $regexMatch: { input: '$sentence', regex: '$$word', options: 'i' } } } } } }, " +
        "      else: true " +
        "    } " +
        "  } " +
        "} }",
        
        // 3 post_flagがfalseのものを除外
        "{ $match: { post_flag: { $ne: false } } }",

        // 4. ソート＆制限
        "{ $sort: { postDate: -1 } }",
        "{ $limit: 50 }",

        // 5. profile_collectionとuser_idで結合
        "{ $lookup: { " +
        "  from: 'profile_collection', " +
        "  localField: 'user_id', " +
        "  foreignField: 'user_id', " +
        "  as: 'profile' " +
        "} }",
        
        // 6. profileを展開（preserveNullAndEmptyArraysをtrueに）
        "{ $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } }",
        
        // 7. response_countを計算
        "{ $lookup: { " +
        "  from: 'post_collection', " +
        "  let: { postId: '$_id' }, " +
        "  pipeline: [ " +
        "    { $match: { $expr: { $eq: ['$response_to', '$$postId'] } } }, " +
        "    { $count: 'count' } " +
        "  ], " +
        "  as: 'responses' " +
        "} }",
        
        // 8. like_collectionから検索
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
        
        // 9. bookmark_collectionから検索
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
        
        // 10. 最終的なフィールドを整形
        "{ $project: { " +
        "  _id: 1, " +
        "  postId: '$_id', " +
        "  userId: '$user_id', " +
        "  sentence: '$sentence', " +
        "  imageUrl: '$image_objectKey', " +
        "  shareRange: '$share_range', " +
        "  postDate: '$post_date', " +
        "  likeCount: '$like_Count', " +
        "  nickname: '$profile.nickname', " +
        "  showUserId: '$profile.show_user_id', " +
        "  icon: '$profile.icon', " +
        "  responseCount: '$response_Count', " +
        "  isLiked: { $gt: [{ $size: '$likes' }, 0] }, " +
        "  isBookmarked: { $gt: [{ $size: '$bookmarks' }, 0] } " +
        "} }",
    })
    List<PostDetailResponse> findPostsResponseWithDetails(
        Integer userId,
        ObjectId replyPostId,
        List<String> muteWords
    );


    //キーワード検索投稿取得
    @Aggregation(pipeline = {
        // 1. sentenceにキーワードが含まれるドキュメントをフィルタ
        "{ $match: { sentence: { $regex: ?1, $options: 'i' } } }",

        // 2. post_flagがfalseのものを除外
        "{ $match: { post_flag: { $ne: false } } }",

        // 5. profile_collectionとuser_idで結合
        "{ $lookup: { " +
        "  from: 'profile_collection', " +
        "  localField: 'user_id', " +
        "  foreignField: 'user_id', " +
        "  as: 'profile' " +
        "} }",
        
        // 6. profileを展開（preserveNullAndEmptyArraysをtrueに）
        "{ $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } }",
        
        // 7. response_countを計算
        "{ $lookup: { " +
        "  from: 'post_collection', " +
        "  let: { postId: '$_id' }, " +
        "  pipeline: [ " +
        "    { $match: { $expr: { $eq: ['$response_to', '$$postId'] } } }, " +
        "    { $count: 'count' } " +
        "  ], " +
        "  as: 'responses' " +
        "} }",
        
        // 8. like_collectionから検索
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
        
        // 9. bookmark_collectionから検索
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
        
        // 10. 最終的なフィールドを整形
        "{ $project: { " +
        "  _id: 1, " +
        "  postId: '$_id', " +
        "  userId: '$user_id', " +
        "  sentence: '$sentence', " +
        "  imageUrl: '$image_objectKey', " +
        "  shareRange: '$share_range', " +
        "  postDate: '$post_date', " +
        "  likeCount: '$like_Count', " +
        "  nickname: '$profile.nickname', " +
        "  showUserId: '$profile.show_user_id', " +
        "  icon: '$profile.icon', " +
        "  responseCount: '$response_Count', " +
        "  isLiked: { $gt: [{ $size: '$likes' }, 0] }, " +
        "  isBookmarked: { $gt: [{ $size: '$bookmarks' }, 0] } " +
        "} }",
    })
    List<PostDetailResponse> findPostsByKeywordWithDetails(
        Integer currentUserId,
        String keyword
    );

    }
