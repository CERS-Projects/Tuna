package com.example.backend.profile.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;


import com.example.backend.support.model.ProfileEntity;


@Repository
public interface ProfileRepository extends MongoRepository<Entity, ObjectId> {
  List<ProfileEntity> findByUserId(String userId);


  @Query("{ 'user_id': ?0 }")
    @Update("{ '$set': { 'filter_words': ?1 } }")
    void updateFilterWords(Integer userId, List<String> filterWords);
};

