package com.example.backend.group.facade;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.auth.dto.UserInfo;
import com.example.backend.group.dto.ModifyGroupInfoRequest;
import com.example.backend.group.dto.ModifyGroupMembersRequest;
import com.example.backend.group.dto.ModifyGroupRequest;
import com.example.backend.group.service.GroupMemberService;
import com.example.backend.group.service.GroupService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ModifyGroupFacade {

    private final GroupService groupService;
    private final GroupMemberService groupMemberService;

    @Transactional
    public void modifyGroup(UserInfo userInfo, Integer groupId, ModifyGroupRequest dto) {

        // 親グループ・グループ名の変更
        ModifyGroupInfoRequest modifyGroupInfo = new ModifyGroupInfoRequest();
        modifyGroupInfo.setNewParentGroupId(dto.getParentGroupId());
        modifyGroupInfo.setNewGroupName(dto.getGroupName());

        groupService.modifyGroup(userInfo.getSchoolId(), groupId, modifyGroupInfo);

        // グループメンバーの変更
        ModifyGroupMembersRequest modifyGroupMembers = new ModifyGroupMembersRequest(dto.getParentGroupId(),
                dto.getMembers());

        groupMemberService.modifyGroupMembers(userInfo.getSchoolId(), groupId, modifyGroupMembers);
    }
}
