package com.example.backend.group.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.accounts.service.StudentService;
import com.example.backend.auth.dto.UserInfo;
import com.example.backend.group.dto.DelGroupRequest;
import com.example.backend.group.dto.GetGroupResponse;
import com.example.backend.group.dto.GetUserBySchoolIdRequest;
import com.example.backend.group.dto.GetUserResponse;
import com.example.backend.group.dto.GroupCreateRequest;
import com.example.backend.group.dto.ModifyGroupMembersRequest;
import com.example.backend.group.dto.ModifyUpperGroupRequest;
import com.example.backend.group.service.GroupMemberService;
import com.example.backend.group.service.GroupService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
@RequestMapping("/groups")
public class GroupController {

    private final GroupService groupService;

    private final GroupMemberService groupMemberService;

    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<List<GetGroupResponse>> getAllGroups(@AuthenticationPrincipal UserInfo userInfo) {
        List<GetGroupResponse> groupList = groupService.getAllGroups(userInfo);
        return ResponseEntity.ok().body(groupList);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteGroup(@Valid @RequestBody DelGroupRequest dto) {
        groupService.deleteGroup(dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<List<GetGroupResponse>> getMyGroups(@AuthenticationPrincipal UserInfo userInfo) {
        List<GetGroupResponse> groupList = groupService.getMyGroups(userInfo);
        return ResponseEntity.ok().body(groupList);
    }

    @GetMapping("/users") // （{groupId}/usersにする予定 @PathVariable）
    public ResponseEntity<List<GetUserResponse>> getUsersList(@Valid @ModelAttribute GetUserBySchoolIdRequest dto) {
        List<GetUserResponse> usersList = studentService.findAllGroups(dto);
        return ResponseEntity.ok().body(usersList);
    }

    @PostMapping("/new")
    public ResponseEntity<Void> createGroup(@Valid @RequestBody GroupCreateRequest dto) {
        groupService.createGroup(dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/modify/member") // （{groupId}/membersにする予定 @PathVariable）
    public ResponseEntity<Void> modifyGroupMembers(@Valid @RequestBody ModifyGroupMembersRequest dto) {
        groupMemberService.modifyGroupMembers(dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/modify/upper-group") // （{groupId}/upper-groupsにする予定 @PathVariable）
    public ResponseEntity<Void> modifyUpperGroup(@Valid @RequestBody ModifyUpperGroupRequest dto) {
        groupService.modifyUpperGroup(dto);
        return ResponseEntity.ok().build();
    }
}
