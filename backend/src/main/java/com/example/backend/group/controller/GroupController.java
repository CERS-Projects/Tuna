package com.example.backend.group.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.accounts.service.StudentService;
import com.example.backend.group.dto.GetUserBySchoolId;
import com.example.backend.group.dto.GetUserResponse;
import com.example.backend.group.dto.GroupCreateRequest;
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

    private final StudentService studentService;

    @Transactional
    @GetMapping("/get-user")
    public ResponseEntity<List<GetUserResponse>> getUsersList(@Valid @RequestBody GetUserBySchoolId dto){
        List<GetUserResponse> usersList = studentService.findAllGroup(dto);
        return ResponseEntity.ok().body(usersList);
    }

    @Transactional
    @PostMapping("/create-group")
    public ResponseEntity<Void> createGroup(@Valid @RequestBody GroupCreateRequest dto){
        groupService.createGroup(dto);
        return ResponseEntity.ok().build();
    }
    
}
