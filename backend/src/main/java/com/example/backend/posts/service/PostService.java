package com.example.backend.posts.service;

import java.util.List;

import org.springframework.security.core.Authentication;

import com.example.backend.auth.dto.UserInfo;
import com.example.backend.posts.dto.PostDetailResponse;
import com.example.backend.posts.dto.PostInsertRequest;

public interface PostService {

    void insertPost(PostInsertRequest post, Integer userId);

    PostDetailResponse getPostById(Authentication authentication, String postId, UserInfo userInfo);

    List<PostDetailResponse> getTimelinePosts(Integer shareRange, Authentication authentication, UserInfo userInfo);

    List<PostDetailResponse> getUserPosts(Integer targetUserId, Integer currentUserId);

    List<PostDetailResponse> getReplyPosts(String replypostId, Integer currentUserId);

    List<PostDetailResponse> getPostsByKeyword(Authentication authentication, String keyword, UserInfo userInfo,
            List<Integer> shareRange);

    void deletePost(String postId, Integer userId);

}
