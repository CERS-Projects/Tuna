package com.example.backend.accounts.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import com.example.backend.accounts.dto.TeacherCreateRequestInApp;
import com.example.backend.accounts.model.UserEntity;
import com.example.backend.accounts.service.AdminUserService;
import com.example.backend.accounts.service.CreateUserService;

@RequestMapping("/accounts")
@RestController
@RequiredArgsConstructor
public class TeacherController {

    /* CreateUserServiceの依存注入 */
    private final CreateUserService createUserService;
    /* AdminUserServiceの依存注入 */
    private final AdminUserService adminUserService;

    @PostMapping("/teacher")
    public ResponseEntity<Void> createTeacher(@RequestBody @Valid TeacherCreateRequestInApp requestDto){

        UserEntity newTeacherAccount = new UserEntity();

        /* 教師アカウントの作成 */
        newTeacherAccount = createUserService.createTeacher(requestDto);
        
        /* 権限の設定(権限無し) */
        adminUserService.authorityNotGrant(newTeacherAccount);

        return ResponseEntity.ok().build();
    }
}
