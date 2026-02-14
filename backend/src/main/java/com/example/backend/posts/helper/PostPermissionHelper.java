package com.example.backend.posts.helper;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Component;
import com.example.backend.utils.accountConfirm.GroupJoinByUserId;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PostPermissionHelper {

    private final GroupJoinByUserId groupJoinByUserId;
    
    // 投稿閲覧権限確認
    public boolean canViewPost(Integer userId, List<Integer> postShareRange) {
        Set<Integer> userGroups = new HashSet<>(
                groupJoinByUserId.getJoinedGroupIdsByUserId(userId));
        userGroups.add(0);

        return postShareRange.stream().anyMatch(userGroups::contains);
    }

    // ユーザーの所属グループIDを取得
    public List<Integer> getUserGroupIds(Integer userId) {
        return groupJoinByUserId.getJoinedGroupIdsByUserId(userId);
    }
}
