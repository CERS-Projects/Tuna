package com.example.backend.profile.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.example.backend.profile.service.ProfileService;
import com.example.backend.profile.service.FollowQueryService;
import com.example.backend.profile.dto.FollowingProfileResponse;
import com.example.backend.profile.dto.ProfileResponse;
import com.example.backend.profile.dto.FilterWordUpdateRequest;
import com.example.backend.profile.dto.ProfileUpdateRequest;
import com.example.backend.auth.dto.UserInfo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import jakarta.validation.Valid;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/profile")
public class ProfileController {

    private final ProfileService profileService;

    private final FollowQueryService followQueryService;

    @PostMapping
    public ResponseEntity<Void> createProfile(@AuthenticationPrincipal UserInfo userInfo) {
        
        profileService.createProfile(userInfo.getUserId());
        log.info("プロフィールを作成しました userId: {}", userInfo.getUserId());
        return ResponseEntity.ok().build();
    }

    // 他ユーザープロフィール取得
    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(
            @RequestParam Integer targetUserId,
            @AuthenticationPrincipal UserInfo userInfo) {
        
        ProfileResponse profile = profileService.getProfilesByUserId(targetUserId, userInfo.getUserId());
        return ResponseEntity.ok(profile);
    }

    // 自分のプロフィール取得
    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile(@AuthenticationPrincipal UserInfo userInfo) {
        ProfileResponse profile;
        
        try{
            profile = profileService.getProfilesByUserId(userInfo.getUserId(), userInfo.getUserId());
            if(profile == null) {
                log.warn("プロフィールが見つかりません userId: {}", userInfo.getUserId());
                return ResponseEntity.notFound().build();
            }
        } catch(Exception e) {
            log.error("プロフィールの取得に失敗しました userId: {}", userInfo.getUserId(), e);
            return ResponseEntity.status(500).build();
        }
        return ResponseEntity.ok(profile);
    }

    // プロフィール更新
    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> updateProfile(
            @Valid @ModelAttribute ProfileUpdateRequest request,
            @AuthenticationPrincipal UserInfo userInfo) {
        
        profileService.updateProfile(request, userInfo.getUserId());
        log.info("プロフィールを更新しました userId: {}", userInfo.getUserId());
        return ResponseEntity.ok().build();
    }

    // プロフィール削除
    @DeleteMapping
    public ResponseEntity<Void> deleteProfile(@AuthenticationPrincipal UserInfo userInfo) {
        
        profileService.deleteProfile(userInfo.getUserId());
        log.info("プロフィールを削除しました userId: {}", userInfo.getUserId());
        return ResponseEntity.ok().build();
    }

    // フィルターワード更新
    @PutMapping("/filter-words")
    public ResponseEntity<Void> updateFilterWords(
            @RequestBody FilterWordUpdateRequest request,
            @AuthenticationPrincipal UserInfo userInfo) {
        
        profileService.updateFilterWords(userInfo.getUserId(), request.getFilterWords());
        log.info("フィルターワードを更新しました userId: {}", userInfo.getUserId());
        return ResponseEntity.ok().build();
    }
    // フィルターワード取得
    @GetMapping("/filter-words")
    public ResponseEntity<List<String>> getFilterWords(@AuthenticationPrincipal UserInfo userInfo) {
        
        List<String> filterWords = profileService.getFilterWords(userInfo.getUserId());
        return ResponseEntity.ok(filterWords);
    }

    // フォロー一覧取得
    @GetMapping("/following/me")
    public ResponseEntity<List<FollowingProfileResponse>> getFollowing(@AuthenticationPrincipal UserInfo userInfo) {
        
        List<FollowingProfileResponse> following = followQueryService.getFollowingAccounts(userInfo.getUserId());
        return ResponseEntity.ok(following);
    }

    // 他ユーザーのフォロー一覧取得
    @GetMapping("/following")
    public ResponseEntity<List<FollowingProfileResponse>> getUserFollowing(@RequestParam Integer targetUserId) {
        
        List<FollowingProfileResponse> following = followQueryService.getFollowingAccounts(targetUserId);
        return ResponseEntity.ok(following);
    }

    // フォロワー一覧取得
    @GetMapping("/followers/me")
    public ResponseEntity<List<FollowingProfileResponse>> getFollowers(@AuthenticationPrincipal UserInfo userInfo) {
        
        List<FollowingProfileResponse> followers = followQueryService.getFollowerAccounts(userInfo.getUserId());
        return ResponseEntity.ok(followers);
    }

    // 他ユーザーのフォロワー一覧取得
    @GetMapping("/followers")
    public ResponseEntity<List<FollowingProfileResponse>> getUserFollowers(@RequestParam Integer targetUserId) {
        
        List<FollowingProfileResponse> followers = followQueryService.getFollowerAccounts(targetUserId);
        return ResponseEntity.ok(followers);
    }

    // フォロー追加
    @PostMapping("/follow")
    public ResponseEntity<Void> followUser(
            @RequestParam Integer targetUserId,
            @AuthenticationPrincipal UserInfo userInfo) {
        followQueryService.addFollowRelation(userInfo.getUserId(), targetUserId);
        return ResponseEntity.ok().build();
    }

    // フォロー解除
    @DeleteMapping("/unfollow")
    public ResponseEntity<Void> unfollowUser(
            @RequestParam Integer targetUserId,
            @AuthenticationPrincipal UserInfo userInfo) {
        followQueryService.removeFollowRelation(userInfo.getUserId(), targetUserId);
        return ResponseEntity.ok().build();
    }
}
