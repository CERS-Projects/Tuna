package com.example.backend.profile.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileResponse {

    Integer userId;
    String showUserId;
    String nickname;
    String iconUrl;
    String introduction;
    Integer followCount;
    Integer followerCount;
    Boolean isFollowed;
    Boolean isFollowing;
}
