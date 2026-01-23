package com.example.backend.posts.service;


import com.example.backend.posts.model.SearchHistoryEntity;
import com.example.backend.posts.model.SearchHistoryItem;

import java.util.List;


public interface SearchHistoryService {
    void addSearchHistory(Integer userId, String query);

    List<SearchHistoryItem> getSearchHistory(Integer userId);

    void removeSearchHistory(Integer userId, String query);
}
