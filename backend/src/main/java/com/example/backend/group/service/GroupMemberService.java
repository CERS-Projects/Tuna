package com.example.backend.group.service;

import java.util.List;

import com.example.backend.group.dto.ModifyGroupMembersRequest;

/**
 * グループメンバーに関するサービスインターフェース
 */
public interface GroupMemberService {
    void groupMemberToDB(List<Integer> membersUserId, Integer groupId);
    void modifyGroupMembers(ModifyGroupMembersRequest dto);
    void deleteMembersByGroupId(Integer groupId);
}
