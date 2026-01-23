package com.example.backend.group.service;

import java.util.List;

import com.example.backend.group.dto.DelGroupRequest;
import com.example.backend.group.dto.GetGroupRequest;
import com.example.backend.group.dto.GetGroupResponse;
import com.example.backend.group.dto.GroupCreateRequest;

/**
 * グループに関するサービスインターフェース
 */
public interface GroupService {
     void createGroup(GroupCreateRequest dto);
     void deleteGroup(DelGroupRequest dto);
     List<GetGroupResponse> getAllGroups(GetGroupRequest dto);
}
