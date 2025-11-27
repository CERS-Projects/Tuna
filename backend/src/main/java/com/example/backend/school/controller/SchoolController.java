package com.example.backend.school.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.school.dto.CreateSchoolIntegrationDto;
import com.example.backend.school.model.CreateTeacherUserEntity;
import com.example.backend.school.service.AdminUserService;
import com.example.backend.school.service.CreateUserService;
import com.example.backend.school.service.SchoolService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


/* 学校登録に係る処理 */
@RestController
@RequestMapping("/api/school")
@RequiredArgsConstructor
public class SchoolController {

    /* 依存性の注入 */
    private final SchoolService schoolService;
    private final AdminUserService adminUserService;
    private final CreateUserService createUserService;
    
    @PostMapping("/create")
    public void createSchool(@RequestBody @Valid CreateSchoolIntegrationDto requestDto){
        final Integer schoolId;
        final CreateTeacherUserEntity newTeacherAccount;

        /* 学校情報の登録を行う */
        schoolId = schoolService.createSchool(requestDto.getSchoolDto());

        /* 教師アカウントの登録を行う */
        newTeacherAccount = createUserService.createTeacher(requestDto.getCreateTeacherDto(), schoolId);

        /* 管理者権限を教師アカウントに付与する */
        adminUserService.createAdmin(newTeacherAccount, requestDto.getCreateTeacherDto().getAuthorityFlag());
    }

} 
