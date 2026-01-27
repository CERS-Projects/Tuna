package com.example.backend.utils.accountConfirm;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.backend.accounts.repository.UserRepository;
import com.example.backend.group.repository.GroupMemberRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AccountConfirm {
    private final UserRepository userRepository;

    private final GroupMemberRepository groupMemberRepository;
    public Boolean existsByUserIdBySchoolId(Integer userId, Integer schoolId) {
        return userRepository.existsByUserIdAndSchoolId(userId, schoolId);
    }

    public Boolean isExistsAllGroups(Integer userId, Integer... groupIds) {
        Set<Integer> uniqueGroupIds = Arrays.stream(groupIds).collect(Collectors.toSet());

        Long joinedCount = groupMemberRepository.countDistinctByGroupIdIn(new ArrayList<>(uniqueGroupIds));

        return joinedCount == uniqueGroupIds.size();
    }
}
