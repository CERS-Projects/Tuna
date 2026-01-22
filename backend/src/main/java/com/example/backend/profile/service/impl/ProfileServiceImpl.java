package com.example.backend.profile.service.impl;

import org.springframework.stereotype.Service;
import com.example.backend.profile.service.ProfileService;
import java.util.List;
import com.example.backend.support.model.ProfileEntity;
import com.example.backend.profile.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;

    public void createProfile(Integer userId, String showUserId) {
        ProfileEntity profile = new ProfileEntity();
        profile.setUserId(userId);
        profile.setShowUserId(showUserId);
        profile.setIconObjectKey("default/icon/path");
        profile.setFollowCount(0);
        profile.setFollowerCount(0);
      profileRepository.save(profile);
    }

    public void updateProfile(ProfileEntity profile) {
        profileRepository.save(profile);
    }

    public void updatefilterWord(Integer userId, List<String> filterWords) {
        profileRepository.updateFilterWords(userId, filterWords);
    }

    public void deleteProfile(String userId) {
        profileRepository.deleteById(userId);
    }
  
    
    public List<ProfileEntity> getProfilesByUserId(String userId) {
        return profileRepository.findByUserId(userId);
    }




}
