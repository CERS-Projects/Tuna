package com.example.backend.profile.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileResponse {

    private Integer userId;
    private String showUserId;
    private String nickname;
    private String iconUrl;
    private String introduction;
    private Integer followCount;
    private Integer followerCount;
    private Boolean isFollowed;
    private Boolean isFollowing;
}
