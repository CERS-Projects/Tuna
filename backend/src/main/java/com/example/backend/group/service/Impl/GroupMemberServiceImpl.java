package com.example.backend.group.service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.group.dto.ModifyGroupMembersRequest;
import com.example.backend.group.model.GroupMemberEntity;
import com.example.backend.group.repository.GroupMemberRepository;
import com.example.backend.group.service.GroupMemberService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class GroupMemberServiceImpl implements GroupMemberService {

    private final GroupMemberRepository groupMemberRepository;

    @Override
    @Transactional
    public void modifyGroupMembers(ModifyGroupMembersRequest dto) {
        List<GroupMemberEntity> toSaveMembers = dto.getMembers()
        .stream()
        .filter(member->member.getModifiedIsJoined() == true)
        .map(groupMembers->{
            GroupMemberEntity member = new GroupMemberEntity();
            member.setGroupId(dto.getGroupId());
            member.setUserId(groupMembers.getUserId());
            return member;
        })
        .collect(Collectors.toList());
                                        
        List<GroupMemberEntity> toDeleteMembers = dto.getMembers()
        .stream()
        .filter(member->member.getModifiedIsJoined() == false)
        .map(groupMembers->{
            GroupMemberEntity member = new GroupMemberEntity();
            member.setGroupId(dto.getGroupId());
            member.setUserId(groupMembers.getUserId());
            return member;
        })
        .collect(Collectors.toList());


        groupMemberRepository.saveAll(toSaveMembers);
        groupMemberRepository.deleteAll(toDeleteMembers);
    }

    @Override
    @Transactional
    public void GroupMemberToDB(List<Integer> membersUserId, Integer groupId) {

        List<GroupMemberEntity> members = membersUserId
        .stream()
        .map(memberUserId->{
            GroupMemberEntity member = new GroupMemberEntity();
            member.setGroupId(groupId);
            member.setUserId(memberUserId);
            return member;
        })
        .collect(Collectors.toList());

        groupMemberRepository.saveAll(members);
    }

    @Override
    @Transactional
    public void toDeleteMembersByGroupId(Integer groupId) {
        groupMemberRepository.deleteByGroupId(groupId);
    }
}
