package com.example.backend.posts.service.impl;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.example.backend.posts.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.backend.posts.model.LikeEntity;
import com.example.backend.posts.service.LikeService;
import lombok.extern.slf4j.Slf4j;


@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {

    
    private final LikeRepository likeRepository;
    }


