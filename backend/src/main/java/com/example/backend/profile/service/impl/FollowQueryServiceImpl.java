package com.example.backend.profile.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.example.backend.profile.repository.FollowRelationRepository;
import com.example.backend.profile.repository.ProfileRepository;
import com.example.backend.profile.dto.FollowingProfileResponse;
import com.example.backend.profile.model.FollowRelationEntity;
import com.example.backend.profile.model.UserprofileEntity;
import com.example.backend.profile.service.FollowQueryService;
import com.example.backend.utils.fileUtil.helper.FileControlHelper;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FollowQueryServiceImpl implements FollowQueryService {

    private final FollowRelationRepository followRelationRepository;
    private final ProfileRepository profileRepository;
    private final FileControlHelper fileControlHelper;

        // 自分がフォローしているアカウント一覧を取得
        @Override
        public List<FollowingProfileResponse> getFollowingAccounts(Integer userId) {
            try{
                // 1) 自分がフォローしている相手ID一覧
                List<FollowRelationEntity> relations = followRelationRepository.findByFollowerId(userId);
                log.info("取得したフォロー関係: {}", relations);
                if (relations.isEmpty()) return List.of();

                List<Integer> followingIds = relations.stream()
                        .map(FollowRelationEntity::getFollowingId)
                        .distinct()
                        .toList();

                // 2) 相手プロフィールをまとめて取得
                List<UserprofileEntity> profiles = profileRepository.findByUserIdIn(followingIds);

                Map<Integer, UserprofileEntity> profileMap = profiles.stream()
                        .collect(Collectors.toMap(UserprofileEntity::getUserId, Function.identity(), (a, b) -> a));

                // 3) isFollowing を まとめて判定
                Set<Integer> actuallyFollowing = followRelationRepository
                        .findByFollowerIdAndFollowingIdIn(userId, followingIds)
                        .stream()
                        .map(FollowRelationEntity::getFollowingId)
                        .collect(Collectors.toSet());

                List<FollowingProfileResponse> result = new ArrayList<>();
                for (Integer fid : followingIds) {
                    UserprofileEntity p = profileMap.get(fid);
                    if (p == null) {
                        continue;
                    }
                    result.add(new FollowingProfileResponse(
                            fid,
                            p.getNickname(),
                            p.getShowUserId(),
                            actuallyFollowing.contains(fid),
                            followRelationRepository.existsByFollowerIdAndFollowingId(fid, userId),
                            fileControlHelper.getFileUrl(p.getIconObjectKey())
                    ));
                }
                log.info("フォローしているアカウント一覧を取得しました userId: {}", userId);
                return result;

            }catch(Exception e){
                log.error("フォローしているアカウント一覧の取得に失敗しました: {}", e);
                throw new RuntimeException("フォローしているアカウント一覧の取得に失敗しました");
            }
        }

        // 自分をフォローしているアカウント一覧を取得
        @Override
        public List<FollowingProfileResponse> getFollowerAccounts(Integer userId) {
            try{
                // 1) 自分をフォローしている相手ID一覧
                List<FollowRelationEntity> relations = followRelationRepository.findByFollowingId(userId);

                if (relations.isEmpty()) return List.of();

                List<Integer> followerIds = relations.stream()
                        .map(FollowRelationEntity::getFollowerId)
                        .distinct()
                        .toList();

                // 2) 相手プロフィールをまとめて取得
                List<UserprofileEntity> profiles = profileRepository.findByUserIdIn(followerIds);

                Map<Integer, UserprofileEntity> profileMap = profiles.stream()
                        .collect(Collectors.toMap(UserprofileEntity::getUserId, Function.identity(), (a, b) -> a));

                // 3) isFollowing を まとめて判定
                Set<Integer> actuallyFollowing = followRelationRepository
                        .findByFollowerIdAndFollowingIdIn(userId, followerIds)
                        .stream()
                        .map(FollowRelationEntity::getFollowingId)
                        .collect(Collectors.toSet());

                List<FollowingProfileResponse> result = new ArrayList<>();
                for (Integer fid : followerIds) {
                    UserprofileEntity p = profileMap.get(fid);
                    if (p == null) {
                        continue;
                    }
                    result.add(new FollowingProfileResponse(
                            fid,
                            p.getShowUserId(),
                            p.getNickname(),
                            actuallyFollowing.contains(fid),
                            followRelationRepository.existsByFollowerIdAndFollowingId(fid, userId),
                            fileControlHelper.getFileUrl(p.getIconObjectKey())
                    ));
                }
                log.info("フォロワーアカウント一覧を取得しました userId: {}", userId);
                return result;

            }catch(Exception e){
                log.error("フォロワーアカウント一覧の取得に失敗しました: {}", e);
                throw new RuntimeException("フォロワーアカウント一覧の取得に失敗しました");
            }
        }

        //フォロー関係の追加
        @Override
        public void addFollowRelation(Integer followerId, Integer followingId) {
            FollowRelationEntity relation = new FollowRelationEntity();
            relation.setFollowerId(followerId);
            relation.setFollowingId(followingId);
            relation.setCreatedAt(Date.from(OffsetDateTime.now().toInstant()));
            try{
                //フォロー関係の存在確認
                if(followRelationRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
                    log.warn("フォロー関係は既に存在します followerId: {}, followingId: {}", followerId, followingId);
                    throw new RuntimeException("フォロー関係は既に存在します");
                }
                followRelationRepository.save(relation);
                log.info("フォロー関係を追加しました followerId: {}, followingId: {}", followerId, followingId);
            } catch(Exception e){
                log.error("フォロー関係の追加に失敗しました: {}", e);
                throw  new RuntimeException("フォロー関係の追加に失敗しました");
            }
        }
        
        //フォロー関係の削除
        @Override
        public void removeFollowRelation(Integer followerId, Integer followingId) {

            //フォロー関係の存在確認
            if(!followRelationRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
                log.warn("フォロー関係が存在しません followerId: {}, followingId: {}", followerId, followingId);
                throw new RuntimeException("フォロー関係が存在しません");
            }
            try{
                followRelationRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
                log.info("フォロー関係を削除しました followerId: {}, followingId: {}", followerId, followingId);
            } catch(Exception e){
                log.error("フォロー関係の削除に失敗しました: {}", e);
                throw  new RuntimeException("フォロー関係の削除に失敗しました");
            }
        }
}