package com.example.backend.posts.service.impl;

import org.springframework.stereotype.Service;
import com.example.backend.posts.service.SearchHistoryService;

import com.example.backend.posts.repository.SearchHistoryRepository;
import lombok.RequiredArgsConstructor;
import com.example.backend.posts.model.SerchHistoryEntity;
import java.util.List;


@Service
@RequiredArgsConstructor
public class SearchHistoryServiceImpl implements SearchHistoryService {

    private final SearchHistoryRepository searchHistoryRepository;


}
