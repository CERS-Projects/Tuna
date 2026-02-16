package com.example.backend.group.service;

import java.util.List;
import java.util.Set;

import com.example.backend.group.dto.ModifyGroupMembersRequest;

/**
 * グループメンバーに関するサービスインターフェース
 */
public interface GroupMemberService {
    void groupMemberToDB(List<Integer> membersUserId, Integer groupId);

    void modifyGroupMembers(Integer schoolId, Integer groupId, ModifyGroupMembersRequest dto);

    void deleteMembersByGroupId(Integer groupId);

    Set<Integer> findJoinUserIdsByGroupId(Integer groupId);
}
