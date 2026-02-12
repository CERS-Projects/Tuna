package com.example.backend.profile.service;

import com.example.backend.profile.dto.FollowingProfileResponse;
import java.util.List;

public interface FollowQueryService {

    List<FollowingProfileResponse> getFollowingAccounts(Integer userId);
    
    List<FollowingProfileResponse> getFollowerAccounts(Integer userId);

    void addFollowRelation(Integer followerId, Integer followingId);

    void removeFollowRelation(Integer followerId, Integer followingId);

}
