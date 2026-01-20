package com.example.backend.group.service.Impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.accounts.helper.AccountsHelper;
import com.example.backend.group.dto.DelGroupRequest;
import com.example.backend.group.dto.GetGroupRequest;
import com.example.backend.group.dto.GetGroupResponse;
import com.example.backend.group.dto.GroupCreateRequest;
import com.example.backend.group.helper.GroupHelper;
import com.example.backend.group.model.GroupEntity;
import com.example.backend.group.repository.GroupRepository;
import com.example.backend.group.service.GroupMemberService;
import com.example.backend.group.service.GroupService;
import com.example.backend.school.model.SchoolEntity;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class GroupServiceImpl implements GroupService {

    private final AccountsHelper accountsHelper;

    private final GroupHelper groupHelper;

    private final GroupMemberService groupMemberService;

    private final GroupRepository groupRepository;

    /* グループ作成 */
    @Transactional
    @Override
    public void createGroup(GroupCreateRequest dto){
        GroupEntity groupEntity = toGroupEntity(dto);
        groupRepository.save(groupEntity);
    }

    @Transactional
    @Override
    public List<GetGroupResponse> getAllGroups(GetGroupRequest dto){
        return groupHelper.getTree(dto.getSchoolId());
    }

    @Transactional
    @Override
    public void deleteGroup(DelGroupRequest dto){

        final Integer NEW_PARENT_ID = dto.getParentId();
        final Integer MY_ID = dto.getGroupId();

        groupHelper.updateParentGroup(NEW_PARENT_ID, MY_ID);

        groupMemberService.toDeleteMembersByGroupId(MY_ID);
        groupRepository.deleteAllById(MY_ID);
    }

    /* GroupCreateRequest DTOをGroupEntityに変換 */
    @Transactional
    private GroupEntity toGroupEntity(GroupCreateRequest dto){
        SchoolEntity schoolEntity = accountsHelper.findSchoolEntityById(dto.getSchoolId());
        GroupEntity groupEntity = new GroupEntity();
        GroupEntity parentGroupId = groupHelper.findGroupEntityById(dto.getParentGroupId());
        groupEntity.setGroupName(dto.getGroupName());
        groupEntity.setSchool(schoolEntity);
        groupEntity.setGroup(parentGroupId);

        GroupEntity savedGroupEntity = groupRepository.save(groupEntity);

        groupMemberService.GroupMemberToDB(dto.getMembersUserId(), savedGroupEntity.getGroupId());

        return groupEntity;
    }
}