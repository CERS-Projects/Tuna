package com.example.backend.profile.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.backend.profile.model.FollowRelationEntity;

import java.util.Collection;
import java.util.List;

public interface FollowRelationRepository extends MongoRepository<FollowRelationEntity, String> {

    // 自分がフォローしている相手一覧
    List<FollowRelationEntity> findByFollowerId(Integer followerId);

    // 自分をフォローしている相手一覧
    List<FollowRelationEntity> findByFollowingId(Integer followingId);

    // この相手をフォローしてるか判定
    boolean existsByFollowerIdAndFollowingId(Integer followerId, Integer followingId);

    // 自分がフォローしている相手の中で、指定されたIDリストに含まれるものを取得
    List<FollowRelationEntity> findByFollowerIdAndFollowingIdIn(Integer followerId, Collection<Integer> followingIds);

    // 指定されたIDリストの中で、特定のユーザーをフォローしている関係を取得
    List<FollowRelationEntity> findByFollowerIdInAndFollowingId(Collection<Integer> followerIds, Integer followingId);

    // フォロー関係をidで削除
    void deleteByFollowerIdAndFollowingId(Integer followerId, Integer followingId);
}
