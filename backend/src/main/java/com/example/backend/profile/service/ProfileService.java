package com.example.backend.profile.service;

import java.util.List;

import org.springframework.security.access.method.P;

import com.example.backend.profile.dto.ProfileResponse;
import com.example.backend.profile.dto.ProfileUpdateRequest;

public interface ProfileService {
    void createProfile(Integer userId);

    void updateProfile(ProfileUpdateRequest profile, Integer userId);

    void updateFilterWords(Integer userId, List<String> filterWords);

    void deleteProfile(Integer userId);

    ProfileResponse getProfilesByUserId(Integer currentUserId);

    ProfileResponse getProfileByShowUserId(String showUserId, Integer currentUserId);
    
    List<String> getFilterWords(Integer userId);
}
