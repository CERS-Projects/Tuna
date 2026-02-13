package com.example.backend.posts.service;

import com.example.backend.posts.dto.PostDetailResponse;
import org.springframework.security.core.Authentication;
import org.bson.types.ObjectId;
import java.util.List;

public interface LikeService {
    //いいね追加
    void addLikes(ObjectId postId, Integer userId);
    //いいね削除
    void removeLikes(ObjectId postId, Integer userId);
    //いいね取得
    List<PostDetailResponse> getLikedPosts(Authentication authentication, Integer userId, Integer schoolId);


}
