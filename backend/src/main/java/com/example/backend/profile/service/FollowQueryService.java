package com.example.backend.profile.service;

import com.example.backend.profile.dto.FollowingProfileResponse;
import java.util.List;

public interface FollowQueryService {

    List<FollowingProfileResponse> getFollowingAccounts(Integer userId);
    
    List<FollowingProfileResponse> getFollowerAccounts(Integer userId);

    List<FollowingProfileResponse> getOtherUserFollowingAccounts(Integer targetUserId, Integer currentUserId);

    List<FollowingProfileResponse> getOtherUserFollowerAccounts(Integer targetUserId, Integer currentUserId);

    void addFollowRelation(Integer followerId, Integer followingId);

    void removeFollowRelation(Integer followerId, Integer followingId);

}
