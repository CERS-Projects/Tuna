package com.example.backend.utils.accountConfirm;

import java.util.List;

import org.springframework.stereotype.Component;

import com.example.backend.group.repository.GroupMemberRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class GroupJoinByUserId {

    private final GroupMemberRepository groupMemberRepository;

    public List<Integer> getJoinedGroupIdsByUserId(Integer userId) {
        return groupMemberRepository.findJoinedGroupIdsByUserId(userId);
    }
    
}
