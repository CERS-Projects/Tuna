package com.example.backend.posts.service;

import com.example.backend.posts.dto.PostDetailResponse;
import java.util.List;

public interface BookmarkService {

    void addBookmark(com.example.backend.posts.model.BookmarkEntity bookmark);

    void removeBookmark(com.example.backend.posts.model.BookmarkEntity bookmark);

    List<PostDetailResponse> getBookmarkedPosts(Integer userId);
}
