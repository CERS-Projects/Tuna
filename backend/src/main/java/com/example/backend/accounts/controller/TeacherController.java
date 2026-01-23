package com.example.backend.accounts.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import com.example.backend.accounts.dto.GetFindAllTeacherAccountRequest;
import com.example.backend.accounts.dto.ModifyTeacherAccountRequest;
import com.example.backend.accounts.dto.TeacherCreateRequestInApp;
import com.example.backend.accounts.dto.TeacherInformationResponse;
import com.example.backend.accounts.model.UserEntity;
import com.example.backend.accounts.service.AdminUserService;
import com.example.backend.accounts.service.TeacherService;

@RequestMapping("/accounts")
@RestController
@RequiredArgsConstructor
public class TeacherController {

    /* TeacherServiceの依存注入 */
    private final TeacherService teacherService;
    /* AdminUserServiceの依存注入 */
    private final AdminUserService adminUserService;

    @GetMapping("/teacher/information")
    @Transactional
    public ResponseEntity<List<TeacherInformationResponse>> getTeacherInformation(@Valid @ModelAttribute GetFindAllTeacherAccountRequest dto){
        List<TeacherInformationResponse> responses = teacherService.findTeacherInformationResponses(dto);
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/teacher")
    public ResponseEntity<Void> createTeacher(@RequestBody @Valid TeacherCreateRequestInApp requestDto){
        /* 教師アカウントの作成 */
       UserEntity newTeacherAccount = teacherService.createTeacher(requestDto);
        
        /* 権限の設定(権限無し) */
        adminUserService.authorityNotGrant(newTeacherAccount);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/teacher/modify")
    public ResponseEntity<Void> modifyTeacherAccount(@RequestBody @Valid ModifyTeacherAccountRequest dto){
        teacherService.ModifyTeacherAccountBySchoolId(dto);
        return ResponseEntity.ok().build();
    }
}
