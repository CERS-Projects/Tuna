package com.example.backend.posts.service;


import com.example.backend.posts.dto.PostDetailResponse;
import java.util.List;
import org.bson.types.ObjectId;

public interface BookmarkService {
    //ブックマーク追加
    void addBookmark(ObjectId postId, Integer userId);
    //ブックマーク削除
    void removeBookmark(ObjectId postId, Integer userId);
    //ユーザーのブックマーク取得
    List<PostDetailResponse> getBookmarkedPosts(Integer userId);
}
