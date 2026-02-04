package com.example.backend.profile.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import java.util.Optional;

import com.example.backend.profile.model.UserProfileEntity;

@Repository
public interface ProfileRepository extends MongoRepository<UserProfileEntity, ObjectId> {

    // ユーザープロフィールの取得
    Optional<UserProfileEntity> findByUserId(Integer userId);

    // ユーザープロフィールの削除
    void deleteByUserId(Integer userId);

    // 複数ユーザーのプロフィールを一括取得
    List<UserProfileEntity> findByUserIdIn(Collection<Integer> userIds);

    

    // フィルターワードの更新
    @Query("{ 'user_id': ?0 }")
    @Update("{ '$set': { 'filtering': ?1 } }")
    void updateFilterWords(Integer userId, List<String> filterWords);

    //ユーザーのfilterワードの取得
    @Query("{ 'user_id': ?0 }")
    Optional<UserProfileEntity> getFilterWordsByUserId(Integer userId);

    //increment follow count
    @Query("{ 'user_id': ?0 }")
    @Update("{ '$inc': { 'follow': 1 } }")
    void incrementFollowCount(Integer userId);

    //decrement follow count
    @Query("{ 'user_id': ?0 }")
    @Update("{ '$inc': { 'follow': -1 } }")
    void decrementFollowCount(Integer userId);

    //increment follower count
    @Query("{ 'user_id': ?0 }")
    @Update("{ '$inc': { 'follower': 1 } }")
    void incrementFollowerCount(Integer userId);

    //decrement follower count
    @Query("{ 'user_id': ?0 }")
    @Update("{ '$inc': { 'follower': -1 } }")
    void decrementFollowerCount(Integer userId);
}

