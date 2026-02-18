package com.example.backend.group.helper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.backend.auth.dto.UserInfo;
import com.example.backend.group.dto.GetGroupResponse;
import com.example.backend.group.dto.ModifyGroupInfoRequest;
import com.example.backend.group.model.GroupEntity;
import com.example.backend.group.repository.GroupRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class GroupHelper {

    private final GroupRepository groupRepository;

    /* グループIDから参照先のGroupEntityを取得 */
    public GroupEntity findGroupEntityById(Integer propsUpperGroupId) {

        GroupEntity upperGroup = (propsUpperGroupId != null) ? groupRepository.findById(propsUpperGroupId).orElse(null)
                : null;

        return upperGroup;
    }

    /* 複数のグループのアップデート用 */
    public void updateParentGroups(final Integer NEW_PARENT_ID, final Integer MY_ID) {

        List<GroupEntity> targetGroups = groupRepository.findAllByGroup_GroupId(MY_ID);
        if (targetGroups != null && !targetGroups.isEmpty()) {
            groupRepository.modifyGroupParentIds(NEW_PARENT_ID, targetGroups);
        }
    }

    /* 単一のグループのアップデート用 */
    public void modifyGroup(final ModifyGroupInfoRequest DTO, final Integer MY_ID) {
        Integer parentGroupId = DTO.getNewParentGroupId();
        Integer resolvedParentId = (parentGroupId == null || parentGroupId == 0) ? null : parentGroupId;

        groupRepository.modifyGroupParentIdAndName(resolvedParentId, DTO.getNewGroupName(), MY_ID);

    }

    public List<GetGroupResponse> getTree(Integer schoolId) {
        List<GroupEntity> entities = groupRepository.findBySchool_SchoolId(schoolId);

        Map<Integer, GetGroupResponse> groupMap = entities.stream()
                .map(entity -> {
                    GetGroupResponse dto = new GetGroupResponse();
                    dto.setGroupId(entity.getGroupId());
                    dto.setGroupName(entity.getGroupName());

                    if (entity.getGroup() != null) {
                        dto.setUpperGroupId(entity.getGroup().getGroupId());
                    }
                    return dto;
                })
                .collect(Collectors.toMap(GetGroupResponse::getGroupId, group -> group));

        List<GetGroupResponse> rootGroups = new ArrayList<>();

        for (GetGroupResponse group : groupMap.values()) {
            if (group.getUpperGroupId() == null) {
                rootGroups.add(group);
            } else {
                GetGroupResponse parentGroup = groupMap.get(group.getUpperGroupId());
                if (parentGroup != null) {
                    parentGroup.getBranchGroups().add(group);
                }
            }
        }

        return rootGroups;
    }

    public List<GetGroupResponse> getMyTree(UserInfo userInfo) {
        List<GroupEntity> entities = groupRepository.findBySchoolAndUserId(userInfo.getUserId(),
                userInfo.getSchoolId());

        Map<Integer, GetGroupResponse> groupMap = entities.stream()
                .map(entity -> {
                    GetGroupResponse dto = new GetGroupResponse();
                    dto.setGroupId(entity.getGroupId());
                    dto.setGroupName(entity.getGroupName());

                    if (entity.getGroup() != null) {
                        dto.setUpperGroupId(entity.getGroup().getGroupId());
                    }
                    return dto;
                })
                .collect(Collectors.toMap(GetGroupResponse::getGroupId, group -> group));

        List<GetGroupResponse> rootGroups = new ArrayList<>();

        for (GetGroupResponse group : groupMap.values()) {
            if (group.getUpperGroupId() == null) {
                rootGroups.add(group);
            } else {
                GetGroupResponse parentGroup = groupMap.get(group.getUpperGroupId());
                if (parentGroup != null) {
                    parentGroup.getBranchGroups().add(group);
                }
            }
        }

        return rootGroups;
    }
}
