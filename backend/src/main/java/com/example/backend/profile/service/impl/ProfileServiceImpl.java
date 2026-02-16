package com.example.backend.profile.service.impl;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.profile.service.ProfileService;
import com.example.backend.utils.fileUtil.helper.FileControlHelper;
import com.example.backend.utils.fileUtil.helper.ByteArrayMultipartFile;
import com.example.backend.accounts.repository.UserRepository;
import com.example.backend.accounts.dto.GetUserName;
import com.example.backend.accounts.model.UserEntity;
import java.io.InputStream;

import java.util.List;
import com.example.backend.profile.model.UserProfileEntity;
import com.example.backend.profile.repository.ProfileRepository;
import com.example.backend.profile.dto.ProfileUpdateRequest;
import com.example.backend.profile.repository.FollowRelationRepository;
import com.example.backend.profile.dto.ProfileResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;
    private final FollowRelationRepository followRelationRepository;
    private final FileControlHelper fileControlHelper;
    private final UserRepository userRepository;

    // デフォルトアイコンのクラスパスリソースパス
    private static final String DEFAULT_ICON_RESOURCE = "defaulticon.png";

    // プロフィール作成
    @Override
    public void createProfile(Integer userId) {
        UserProfileEntity profile = new UserProfileEntity();
        GetUserName userInfo = userRepository.findUserName(userId);

        log.info("ユーザー情報取得 userInfo: {}", userInfo);
        profile.setUserId(userId);
        profile.setShowUserId(userInfo.showUserId());
        profile.setNickname(userInfo.name());

        // デフォルトアイコンをクラスパスから読み込みS3にアップロード
        try {
            Resource defaultIconResource = new ClassPathResource(DEFAULT_ICON_RESOURCE);
            byte[] iconBytes;
            try (InputStream is = defaultIconResource.getInputStream()) {
                iconBytes = is.readAllBytes();
            }
            MultipartFile iconFile = new ByteArrayMultipartFile(
                "icon", "defaulticon.png", "image/png", iconBytes
            );
            List<String> keys = fileControlHelper.uploadFile("images", iconFile);
            profile.setIconObjectKey(keys.get(0));
        } catch (Exception e) {
            log.error("デフォルトアイコンのアップロードに失敗しました: ", e);
            throw new RuntimeException("デフォルトアイコンのアップロードに失敗しました"); 
        }

        profile.setFollowCount(0);
        profile.setFollowerCount(0);
        profile.setIntroduction("こんにちは！よろしくお願いします。");
        profile.setFilterWords(List.of());
        profileRepository.save(profile);
    }

    // プロフィール更新
    @Override
    public void updateProfile(ProfileUpdateRequest profile, Integer userId) {
        UserProfileEntity existingProfile = profileRepository.findByUserId(userId)
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

        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new EmptyResultDataAccessException("ユーザー情報の取得に失敗しました", 0));

        userEntity.setShowUserId(profile.getShowUserId());
    }

    // フィルターワードの更新
    @Override
    public void updateFilterWords(Integer userId, List<String> filterWords) {
        try {
            profileRepository.updateFilterWords(userId, filterWords);
        } catch (Exception e) {
            log.error("フィルターワードの更新に失敗しました: ", e);
            throw new RuntimeException("フィルターワードの更新に失敗しました");
        }
    }

    // フィルターワードの取得
    @Override
    public List<String> getFilterWords(Integer userId) {
        try {
            UserProfileEntity profile = profileRepository.findByUserId(userId)
                    .orElseThrow(() -> new  EmptyResultDataAccessException("プロフィールが見つかりません", 1));

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
        UserProfileEntity existingProfile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new  EmptyResultDataAccessException("プロフィールが見つかりません", 1));

        try {
            fileControlHelper.deleteFile(existingProfile.getIconObjectKey());
        } catch (Exception e) {
            log.error("iconファイルの削除に失敗しました: ", e);
            throw new RuntimeException("iconファイルの削除に失敗しました");
        }
        try {
            profileRepository.deleteByUserId(userId);
        } catch (Exception e) {
            log.error("プロフィールの削除に失敗しました: ", e);
            throw new RuntimeException("プロフィールの削除に失敗しました");
        }
    }

    // 自プロフィール取得
    @Override
    public ProfileResponse getProfilesByUserId(Integer currentUserId) {
        ProfileResponse profile = new ProfileResponse();

        UserProfileEntity profileEntity = profileRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new EmptyResultDataAccessException("プロフィールが見つかりません", 1));

        profile.setUserId(profileEntity.getUserId());
        profile.setShowUserId(profileEntity.getShowUserId());
        profile.setNickname(profileEntity.getNickname());
        profile.setIconUrl(fileControlHelper.getFileUrl(profileEntity.getIconObjectKey()));
        profile.setIntroduction(profileEntity.getIntroduction());
        profile.setFollowCount(profileEntity.getFollowCount());
        profile.setFollowerCount(profileEntity.getFollowerCount());
        profile.setIsFollowing(
                followRelationRepository.existsByFollowerIdAndFollowingId(currentUserId, profileEntity.getUserId()));
        profile.setIsFollowed(
                followRelationRepository.existsByFollowerIdAndFollowingId(profileEntity.getUserId(), currentUserId));
        return profile;
    }

    // 他ユーザープロフィール取得
    @Override
    public ProfileResponse getProfileByShowUserId(String showUserId, Integer currentUserId) {
        ProfileResponse profile = new ProfileResponse();
        UserProfileEntity profileEntity = profileRepository.findByShowUserId(showUserId)
                .orElseThrow(() -> new  EmptyResultDataAccessException("プロフィールが見つかりません", 1));

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
