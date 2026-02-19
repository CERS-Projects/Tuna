package com.example.backend.accounts.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import com.example.backend.accounts.dto.ModifyTeacherAccountRequest;
import com.example.backend.accounts.dto.TeacherCreateRequestInApp;
import com.example.backend.accounts.model.UserEntity;
import com.example.backend.accounts.service.AdminUserService;
import com.example.backend.accounts.service.TeacherService;
import com.example.backend.auth.dto.UserInfo;

@RequestMapping("/accounts")
@RestController
@RequiredArgsConstructor
public class TeacherController {

    /* TeacherServiceの依存注入 */
    private final TeacherService teacherService;
    /* AdminUserServiceの依存注入 */
    private final AdminUserService adminUserService;

    @PostMapping("/teacher")
    public ResponseEntity<Void> createTeacher(@AuthenticationPrincipal UserInfo userInfo,
            @RequestBody @Valid TeacherCreateRequestInApp dto) {
        /* 教師アカウントの作成 */
        UserEntity newTeacherAccount = teacherService.createTeacher(dto, userInfo.getSchoolId());

        /* 権限の設定(権限無し) */
        adminUserService.authorityNotGrant(newTeacherAccount);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/teacher")
    public ResponseEntity<Void> deleteTeacher(@AuthenticationPrincipal UserInfo userInfo,
            @RequestParam("userId") Integer userId) {
        teacherService.deleteTeacher(userId, userInfo.getSchoolId());

        return ResponseEntity.ok().build();
    }

    @PostMapping("/teacher/modify")
    public ResponseEntity<Void> modifyTeacherAccount(@RequestBody @Valid ModifyTeacherAccountRequest dto) {
        teacherService.modifyTeacherAccountByUserId(dto);
        return ResponseEntity.ok().build();
    }
}
