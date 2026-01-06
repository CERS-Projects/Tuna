package com.example.backend.posts.service.impl;

import org.springframework.stereotype.Service;
import com.example.backend.posts.service.BookmarkService;
import com.example.backend.posts.repository.BookmarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.RequiredArgsConstructor;
import com.example.backend.posts.model.BookmarkEntity;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
@RequiredArgsConstructor
public class BookmarkServiceImpl implements BookmarkService {

    private final BookmarkRepository bookmarkRepository;

}
