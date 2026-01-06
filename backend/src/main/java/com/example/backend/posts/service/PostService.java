package com.example.backend.posts.service;

import java.util.List;

import com.example.backend.posts.dto.PostDetailDto;
import com.example.backend.posts.dto.GetTimelineRequestDto;
import com.example.backend.posts.dto.PostInsertRequestDto;
import org.springframework.stereotype.Service;

public interface PostService {

    void insertPost(PostInsertRequestDto post);

    List<PostDetailDto> getTimelinePosts(GetTimelineRequestDto requestDto);

    void deletePost(String postId, Integer userId); 

}
