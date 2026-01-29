package com.example.backend.posts.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.backend.posts.model.SearchHistoryEntity;
import com.example.backend.posts.model.SearchHistoryItem;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.bson.types.ObjectId;
import com.mongodb.client.result.UpdateResult;

import java.util.List;
import java.util.Optional;


@Repository
public interface SearchHistoryRepository
        extends MongoRepository<SearchHistoryEntity, ObjectId> {

    SearchHistoryEntity findByUserId(Integer userId);

}

