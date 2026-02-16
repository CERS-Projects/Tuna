package com.example.backend.group.service;

import java.util.List;

import com.example.backend.group.dto.DelGroupRequest;
import com.example.backend.group.dto.GetGroupResponse;
import com.example.backend.group.dto.GroupCreateRequest;
import com.example.backend.group.dto.ModifyUpperGroupRequest;
import com.example.backend.auth.dto.UserInfo;

/**
 * グループに関するサービスインターフェース
 */
public interface GroupService {
     void createGroup(Integer schoolId, GroupCreateRequest dto);

     void deleteGroup(Integer schoolId, DelGroupRequest dto);

     List<GetGroupResponse> getAllGroups(UserInfo userInfo);

     List<GetGroupResponse> getMyGroups(UserInfo userInfo);

     void modifyUpperGroup(Integer schoolId, Integer groupId, ModifyUpperGroupRequest dto);
}
