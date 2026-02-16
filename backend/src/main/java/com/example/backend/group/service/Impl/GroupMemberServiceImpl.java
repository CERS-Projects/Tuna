package com.example.backend.group.service.Impl;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.group.dto.ModifyGroupMembersRequest;
import com.example.backend.group.model.GroupEntity;
import com.example.backend.group.model.GroupMemberEntity;
import com.example.backend.group.repository.GroupMemberRepository;
import com.example.backend.group.repository.GroupRepository;
import com.example.backend.group.service.GroupMemberService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class GroupMemberServiceImpl implements GroupMemberService {

    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;

    @Override
    @Transactional
    public void modifyGroupMembers(Integer schoolId, Integer groupId, ModifyGroupMembersRequest dto) {

        GroupEntity groupEntity = groupRepository.findById(groupId)
                .orElseThrow(() -> new EmptyResultDataAccessException("グループが見つかりません", 0));

        Integer getSchoolId = groupEntity.getSchool().getSchoolId();

        if (!getSchoolId.equals(schoolId)) {
            throw new IllegalArgumentException("不正なリクエストです");
        }

        List<GroupMemberEntity> toSaveMembers = dto.getMembers()
                .stream()
                .filter(member -> member.getModifiedIsJoined() == true)
                .map(groupMembers -> {
                    GroupMemberEntity member = new GroupMemberEntity();
                    member.setGroupId(groupId);
                    member.setUserId(groupMembers.getUserId());
                    return member;
                })
                .collect(Collectors.toList());

        List<GroupMemberEntity> toDeleteMembers = dto.getMembers()
                .stream()
                .filter(member -> member.getModifiedIsJoined() == false)
                .map(groupMembers -> {
                    GroupMemberEntity member = new GroupMemberEntity();
                    member.setGroupId(groupId);
                    member.setUserId(groupMembers.getUserId());
                    return member;
                })
                .collect(Collectors.toList());

        groupMemberRepository.saveAll(toSaveMembers);
        groupMemberRepository.deleteAll(toDeleteMembers);
    }

    @Override
    @Transactional
    public void groupMemberToDB(List<Integer> membersUserId, Integer groupId) {

        List<GroupMemberEntity> members = membersUserId
                .stream()
                .map(memberUserId -> {
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
    public void deleteMembersByGroupId(Integer groupId) {
        groupMemberRepository.deleteByGroupId(groupId);
    }

    @Override
    @Transactional(readOnly = true)
    public Set<Integer> findJoinUserIdsByGroupId(Integer groupId) {
        Set<Integer> members = groupMemberRepository.findUserIdsByGroupId(groupId);
        return members;
    }
}
