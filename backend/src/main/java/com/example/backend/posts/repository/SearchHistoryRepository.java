package com.example.backend.posts.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.backend.posts.model.SerchHistoryEntity;


@Repository
public interface SearchHistoryRepository extends MongoRepository<SerchHistoryEntity, String> {
    
}

