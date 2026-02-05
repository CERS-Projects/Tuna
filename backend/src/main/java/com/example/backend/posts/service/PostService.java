package com.example.backend.posts.service;

import java.util.List;

import com.example.backend.posts.dto.PostDetailResponse;
import com.example.backend.posts.dto.PostInsertRequest;


public interface PostService {

    void insertPost(PostInsertRequest post, Integer userId);

    PostDetailResponse getPostById(String postId, Integer userId);

    List<PostDetailResponse> getTimelinePosts(Integer shareRange, Integer currentUserId);

    List<PostDetailResponse> getUserPosts(Integer targetUserId, Integer currentUserId);

    List<PostDetailResponse> getReplyPosts(String replypostId, Integer currentUserId);
    
    List<PostDetailResponse> getPostsByKeyword(String keyword, Integer currentUserId, List<Integer> shareRange);

    void deletePost(String postId, Integer userId); 

}
