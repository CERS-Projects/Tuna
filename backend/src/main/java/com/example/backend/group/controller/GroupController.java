package com.example.backend.group.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
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
    public ResponseEntity<Void> deleteGroup(@AuthenticationPrincipal UserInfo userInfo, DelGroupRequest dto) {
        groupService.deleteGroup(userInfo.getSchoolId(), dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<List<GetGroupResponse>> getMyGroups(@AuthenticationPrincipal UserInfo userInfo) {
        List<GetGroupResponse> groupList = groupService.getMyGroups(userInfo);
        return ResponseEntity.ok().body(groupList);
    }

    @GetMapping("/users")
    public ResponseEntity<List<GetUserResponse>> getUsersList(@AuthenticationPrincipal UserInfo userInfo,
            @Valid @ModelAttribute GetUserBySchoolIdRequest dto) {
        List<GetUserResponse> usersList = studentService.findAllGroups(userInfo.getSchoolId(), dto);
        return ResponseEntity.ok().body(usersList);
    }

    @PostMapping("/new")
    public ResponseEntity<Void> createGroup(@AuthenticationPrincipal UserInfo userInfo,
            @Valid @RequestBody GroupCreateRequest dto) {
        groupService.createGroup(userInfo.getSchoolId(), dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{groupId}/members")
    public ResponseEntity<Void> modifyGroupMembers(@AuthenticationPrincipal UserInfo userInfo,
            @PathVariable("groupId") Integer groupId, @Valid @RequestBody ModifyGroupMembersRequest dto) {
        groupMemberService.modifyGroupMembers(userInfo.getSchoolId(), groupId, dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{groupId}/upper-group")
    public ResponseEntity<Void> modifyUpperGroup(@AuthenticationPrincipal UserInfo userInfo,
            @PathVariable("groupId") Integer groupId,
            @Valid @RequestBody ModifyUpperGroupRequest dto) {
        groupService.modifyUpperGroup(userInfo.getSchoolId(), groupId, dto);
        return ResponseEntity.ok().build();
    }
}
