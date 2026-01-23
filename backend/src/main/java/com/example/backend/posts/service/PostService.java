package com.example.backend.posts.service;

import java.util.List;

import com.example.backend.posts.dto.PostDetailResponse;
import com.example.backend.posts.dto.PostsReplyRequest;
import com.example.backend.posts.dto.ProfilePostsRequest;
import com.example.backend.posts.dto.TimelinePostsRequest;
import com.example.backend.posts.dto.SearchPostsRequest;
import com.example.backend.posts.dto.PostInsertRequest;
import org.springframework.stereotype.Service;

public interface PostService {

    void insertPost(PostInsertRequest post);

    List<PostDetailResponse> getTimelinePosts(TimelinePostsRequest requestDto);

    List<PostDetailResponse> getUserPosts(ProfilePostsRequest requestDto);

    List<PostDetailResponse> getReplyPosts(PostsReplyRequest requestDto);

    List<PostDetailResponse> getPostsByKeyword(SearchPostsRequest requestDto);

    void deletePost(String postId, Integer userId); 

}
