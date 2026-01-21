package com.example.backend.posts.service;

import com.example.backend.posts.model.BookmarkEntity;
import com.example.backend.posts.dto.IsBookmarkRequest;
import com.example.backend.posts.dto.PostDetailResponse;
import java.util.List;

public interface BookmarkService {

    void addBookmark(IsBookmarkRequest requestDto);

    void removeBookmark(IsBookmarkRequest requestDto);

    List<PostDetailResponse> getBookmarkedPosts(Integer userId);
}
