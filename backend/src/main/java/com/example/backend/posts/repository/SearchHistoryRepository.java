package com.example.backend.posts.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.backend.posts.model.SearchHistoryEntity;
import org.bson.types.ObjectId;


import java.util.List;
import java.util.Optional;


@Repository
public interface SearchHistoryRepository
        extends MongoRepository<SearchHistoryEntity, ObjectId> {

    SearchHistoryEntity findByUserId(Integer userId);

}

