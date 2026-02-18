package com.example.backend.group.service.Impl;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.accounts.helper.AccountsHelper;
import com.example.backend.accounts.repository.UserRepository;
import com.example.backend.auth.dto.UserInfo;
import com.example.backend.group.dto.DelGroupRequest;
import com.example.backend.group.dto.GetGroupResponse;
import com.example.backend.group.dto.GroupCreateRequest;
import com.example.backend.group.dto.ModifyGroupInfoRequest;
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

    private final UserRepository userRepository;

    /* グループ作成 */
    @Transactional
    @Override
    public void createGroup(Integer schoolId, GroupCreateRequest dto) {

        List<Integer> memberList = dto.getMembersUserId();

        long sum = userRepository.countValidUsers(memberList, schoolId);

        if (sum != memberList.size()) {
            throw new IllegalArgumentException("指定されたユーザーの中に、無効なユーザーが含まれています。");
        }

        toGroupEntity(schoolId, dto);
    }

    @Transactional
    @Override
    public List<GetGroupResponse> getAllGroups(UserInfo userInfo) {
        return groupHelper.getTree(userInfo.getSchoolId());
    }

    @Transactional
    @Override
    public List<GetGroupResponse> getMyGroups(UserInfo userInfo) {
        return groupHelper.getMyTree(userInfo);
    }

    @Transactional
    @Override
    public void deleteGroup(Integer schoolId, DelGroupRequest dto) {

        Integer groupId = dto.getGroupId();

        if (groupId == null) {
            throw new IllegalArgumentException("nullの値が含まれています");
        }

        GroupEntity groupEntity = groupRepository.findById(groupId)
                .orElseThrow(() -> new EmptyResultDataAccessException("グループが見つかりません", 0));

        Integer getSchoolId = groupEntity.getSchool().getSchoolId();

        if (!getSchoolId.equals(schoolId)) {
            throw new IllegalArgumentException("不正なリクエストです");
        }

        final Integer newParentId = dto.getParentId();
        final Integer myId = dto.getGroupId();

        groupHelper.updateParentGroups(newParentId, myId);

        groupMemberService.deleteMembersByGroupId(myId);
        groupRepository.deleteAllById(myId);
    }

    @Transactional
    @Override
    public void modifyGroup(Integer schoolId, Integer groupId, final ModifyGroupInfoRequest dto) {

        GroupEntity groupEntity = groupRepository.findById(groupId)
                .orElseThrow(() -> new EmptyResultDataAccessException("グループが見つかりません", 0));

        Integer getSchoolId = groupEntity.getSchool().getSchoolId();

        if (!getSchoolId.equals(schoolId)) {
            throw new IllegalArgumentException("不正なリクエストです");
        }

        groupHelper.modifyGroup(dto, groupId);
    }

    /* GroupCreateRequest DTOをGroupEntityに変換 */
    private GroupEntity toGroupEntity(Integer schoolId, GroupCreateRequest dto) {
        try {
            SchoolEntity schoolEntity = accountsHelper.findSchoolEntityById(schoolId);
            GroupEntity groupEntity = new GroupEntity();
            GroupEntity parentGroup = groupHelper.findGroupEntityById(dto.getParentGroupId());
            groupEntity.setGroupName(dto.getGroupName());
            groupEntity.setSchool(schoolEntity);
            groupEntity.setGroup(parentGroup);

            GroupEntity savedGroupEntity = groupRepository.save(groupEntity);

            groupMemberService.groupMemberToDB(dto.getMembersUserId(), savedGroupEntity.getGroupId());

            return groupEntity;
        } catch (DataIntegrityViolationException e) {
            throw new DataIntegrityViolationException("すでに存在しているグループ名です");
        }

    }
}