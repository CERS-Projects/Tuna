package com.example.backend.profile.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FollowingProfileResponse {
    private Integer userId;
    private String nickname;
    private String showUserId;
    private boolean isFollowing;
    private boolean isFollowed;
    private String iconUrl;
}