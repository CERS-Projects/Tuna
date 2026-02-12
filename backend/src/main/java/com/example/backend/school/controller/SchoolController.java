package com.example.backend.school.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.accounts.model.UserEntity;
import com.example.backend.accounts.service.AdminUserService;
import com.example.backend.accounts.service.TeacherService;
import com.example.backend.auth.dto.UserInfo;
import com.example.backend.school.dto.GetSchoolInformationResponse;
import com.example.backend.school.dto.ModifySchoolInformationRequest;
import com.example.backend.school.dto.ModifySchoolInformationResponse;
import com.example.backend.school.dto.SchoolIntegrationCreate;
import com.example.backend.school.service.SchoolService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/* 学校登録に係る処理 */
@RestController
@RequestMapping("/school")
@RequiredArgsConstructor
@Transactional
public class SchoolController {

    /* 依存性の注入 */
    private final SchoolService schoolService;
    private final AdminUserService adminUserService;
    private final TeacherService createUserService;

    @PostMapping("/create")
    public ResponseEntity<Void> createSchool(@RequestBody @Valid SchoolIntegrationCreate dto){
        final Integer schoolId;
        final UserEntity newTeacherAccount;

        /* 学校情報の登録を行う */
        schoolId = schoolService.createSchool(dto.getSchoolDto());

        /* 教師アカウントの登録を行う */
        newTeacherAccount = createUserService.createTeacher(dto.getCreateTeacherDto(), schoolId);

        /* 管理者権限を教師アカウントに付与する */
        adminUserService.authorityGrant(newTeacherAccount);

        /* HTTPステータスコード 200 で返す。その際レスポンスボディは空 */
        return ResponseEntity.ok().build();
    }

    //学校情報取得
    @GetMapping("/information")
    public ResponseEntity<GetSchoolInformationResponse> getSchoolInformation(@AuthenticationPrincipal UserInfo userInfo){
        GetSchoolInformationResponse response = schoolService.getSchoolInformation(userInfo.getSchoolId());
        return ResponseEntity.ok(response);
    }

    //学校情報修正
    @PostMapping("/modify")
    public ResponseEntity<ModifySchoolInformationResponse> modifySchoolInformation(@Valid @RequestBody ModifySchoolInformationRequest dto, 
                                                                                   @AuthenticationPrincipal UserInfo userInfo){
        ModifySchoolInformationResponse response = schoolService.modifySchoolInformation(dto, userInfo.getSchoolId());
        return ResponseEntity.ok(response);
    }

}
