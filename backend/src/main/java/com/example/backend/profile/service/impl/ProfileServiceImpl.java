package com.example.backend.profile.service.impl;

import org.springframework.stereotype.Service;
import com.example.backend.profile.service.ProfileService;
import com.example.backend.utils.fileUtil.helper.FileControlHelper;  
import com.example.backend.accounts.repository.UserRepository;
import com.example.backend.accounts.dto.GetUserName;
import java.util.List;
import com.example.backend.profile.model.UserprofileEntity;
import com.example.backend.profile.repository.ProfileRepository;
import com.example.backend.profile.dto.ProfileUpdateRequest;  
import com.example.backend.profile.repository.FollowRelationRepository;
import com.example.backend.profile.dto.ProfileResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;
    private final FollowRelationRepository followRelationRepository;
    private final FileControlHelper fileControlHelper;  
    private final UserRepository userRepository;
    // プロフィール作成
    @Override
    public void createProfile(Integer userId) {
        UserprofileEntity profile = new UserprofileEntity();
        GetUserName userInfo = userRepository.findUserName(userId);

        log.info("ユーザー情報取得 userInfo: {}", userInfo);
        profile.setUserId(userId);
        profile.setShowUserId(userInfo.getShowUserId());
        profile.setNickname(userInfo.getName());
        profile.setIconObjectKey("images/fb82d7cb-cf37-4e31-af5c-ec22d602c402.png");
        profile.setFollowCount(0);
        profile.setFollowerCount(0);
        profile.setIntroduction("こんにちは！よろしくお願いします。");
        profile.setFilterWords(List.of());
        profileRepository.save(profile);
    }
    
    // プロフィール更新
    @Override
    public void updateProfile(ProfileUpdateRequest profile, Integer userId) {
        UserprofileEntity existingProfile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("プロフィールが見つかりません"));
        
        if (profile.getIntroduction() != null) {
            existingProfile.setIntroduction(profile.getIntroduction());
        }
        if (profile.getNickname() != null) {
            existingProfile.setNickname(profile.getNickname());
        }
        if (profile.getShowUserId() != null) {
            existingProfile.setShowUserId(profile.getShowUserId());
        }
        if (profile.getIconFile() != null) {
            try {
                fileControlHelper.deleteFile(existingProfile.getIconObjectKey());
            } catch (Exception e) {
                log.error("古いアイコンの削除に失敗しました: ", e);
            }
            List<String> keys = fileControlHelper.uploadFile("images", profile.getIconFile());
            existingProfile.setIconObjectKey(keys.get(0));
        }
        profileRepository.save(existingProfile);
    }
    
    // フィルターワードの更新
    @Override
    public void updateFilterWords(Integer userId, List<String> filterWords) {
        try {
            profileRepository.updateFilterWords(userId, filterWords);
        } catch (Exception e) {
            log.error("フィルターワードの更新に失敗しました: ", e);
        }
    }
    
    
    // フィルターワードの取得
    @Override
    public List<String> getFilterWords(Integer userId) {
        try {
            UserprofileEntity profile = profileRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("プロフィールが見つかりません userId: " + userId));
            
            if(profile.getFilterWords() != null) {
                return profile.getFilterWords();

            } else {
                log.info("フィルターワードは設定されていません userId: {}", userId);
                return List.of();
            }
        } catch (Exception e) {
            log.error("フィルターワードの取得に失敗しました: ", e);
            return List.of();
        }
    }

    // プロフィール削除
    @Override
    public void deleteProfile(Integer userId) {
        UserprofileEntity existingProfile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("プロフィールが見つかりません userId: " + userId));
        
        try {
            fileControlHelper.deleteFile(existingProfile.getIconObjectKey());
        } catch (Exception e) {
            log.error("iconファイルの削除に失敗しました: ", e);
        }
        try {
            profileRepository.deleteByUserId(userId);
        } catch (Exception e) {
            log.error("プロフィールの削除に失敗しました: ", e);
        }
    }

    // プロフィール取得
    @Override
    public ProfileResponse getProfilesByUserId(Integer targetUserId, Integer currentUserId) {
        ProfileResponse profile = new ProfileResponse();
        
        UserprofileEntity profileEntity = profileRepository.findByUserId(targetUserId)
                .orElseThrow(() -> new RuntimeException("プロフィールが見つかりません userId: " + targetUserId));

        profile.setUserId(profileEntity.getUserId());
        profile.setShowUserId(profileEntity.getShowUserId());
        profile.setNickname(profileEntity.getNickname());
        profile.setIconUrl(fileControlHelper.getFileUrl(profileEntity.getIconObjectKey()));
        profile.setIntroduction(profileEntity.getIntroduction());
        profile.setFollowCount(profileEntity.getFollowCount());
        profile.setFollowerCount(profileEntity.getFollowerCount());
        profile.setIsFollowing(followRelationRepository.existsByFollowerIdAndFollowingId(currentUserId, profileEntity.getUserId()));
        profile.setIsFollowed(followRelationRepository.existsByFollowerIdAndFollowingId(profileEntity.getUserId(), currentUserId));
        return profile;
    }

}
