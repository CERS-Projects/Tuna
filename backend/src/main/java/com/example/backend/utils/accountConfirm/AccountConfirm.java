package com.example.backend.utils.accountConfirm;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.backend.accounts.repository.UserRepository;
import com.example.backend.group.repository.GroupMemberRepository;
import com.example.backend.group.repository.GroupRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AccountConfirm {
    private final UserRepository userRepository;

    private final GroupMemberRepository groupMemberRepository;

    private final GroupRepository groupRepository;

    public Boolean existsByUserIdBySchoolId(Integer userId, Integer schoolId) {
        return userRepository.existsByUserIdAndSchoolId(userId, schoolId);
    }

    public Boolean isExistsAllGroups(Integer userId, Integer... groupIds) {
        Set<Integer> uniqueGroupIds = Arrays.stream(groupIds).collect(Collectors.toSet());

        Long joinedCount = groupMemberRepository.countDistinctByGroupIdIn(new ArrayList<>(uniqueGroupIds), userId);

        return joinedCount == uniqueGroupIds.size();
    }

    public boolean isAllGroupsBelongToSchool(Integer schoolId, List<Integer> groupIds) {
        List<Integer> nonPublicGroupIds = groupIds.stream()
                .filter(id -> id != 0)
                .distinct()
                .toList();

        if (nonPublicGroupIds.isEmpty()) {
            return true;
        }

        long count = groupRepository.countGroupsBySchoolIdAndGroupIds(schoolId, nonPublicGroupIds);
        return count == nonPublicGroupIds.size();
    }
}
