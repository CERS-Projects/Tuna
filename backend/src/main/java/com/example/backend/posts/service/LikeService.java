package com.example.backend.posts.service;

import com.example.backend.posts.dto.PostDetailResponse;
import com.example.backend.posts.model.LikeEntity;
import com.example.backend.posts.dto.IsLikeRequest;
import java.util.List;

public interface LikeService {

    void addLikes(IsLikeRequest requestDto);

    void removeLikes(IsLikeRequest requestDto);

    List<PostDetailResponse> getLikedPosts(Integer userId);


}
