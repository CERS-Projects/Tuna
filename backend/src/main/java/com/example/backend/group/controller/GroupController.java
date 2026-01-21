package com.example.backend.group.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.accounts.service.StudentService;
import com.example.backend.group.dto.DelGroupRequest;
import com.example.backend.group.dto.GetGroupRequest;
import com.example.backend.group.dto.GetGroupResponse;
import com.example.backend.group.dto.GetUserBySchoolId;
import com.example.backend.group.dto.GetUserResponse;
import com.example.backend.group.dto.GroupCreateRequest;
import com.example.backend.group.dto.ModifyGroupMembersRequest;
import com.example.backend.group.service.GroupMemberService;
import com.example.backend.group.service.GroupService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequiredArgsConstructor
@RequestMapping("/group")
public class GroupController {

    private final GroupService groupService;

    private final GroupMemberService groupMemberService;

    private final StudentService studentService;

    @Transactional
    @GetMapping("/get-user")
    public ResponseEntity<List<GetUserResponse>> getUsersList(@Valid @ModelAttribute GetUserBySchoolId dto){
        List<GetUserResponse> usersList = studentService.findAllGroups(dto);
        return ResponseEntity.ok().body(usersList);
    }

    @Transactional
    @GetMapping("/get-all-groups")
    public ResponseEntity<List<GetGroupResponse>> getAllGroups(@Valid @ModelAttribute GetGroupRequest dto){
        List<GetGroupResponse> groupList = groupService.getAllGroups(dto);
        return ResponseEntity.ok().body(groupList);
    }

    @Transactional
    @PostMapping("/create-group")
    public ResponseEntity<Void> createGroup(@Valid @RequestBody GroupCreateRequest dto){
        groupService.createGroup(dto);
        return ResponseEntity.ok().build();
    }

    @Transactional
    @PostMapping("/modify-group-members")
    public ResponseEntity<Void> modifyGroupMembers(@Valid @RequestBody ModifyGroupMembersRequest dto){
        groupMemberService.modifyGroupMembers(dto);
        return ResponseEntity.ok().build();
    }

    @Transactional
    @PostMapping("delete-group")
    public ResponseEntity<Void> deleteGroup(@Valid @RequestBody DelGroupRequest dto){
        groupService.deleteGroup(dto);
        return ResponseEntity.ok().build();
    }
}
