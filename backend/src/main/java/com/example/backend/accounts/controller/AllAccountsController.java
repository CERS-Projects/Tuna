package com.example.backend.accounts.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.accounts.dto.AllAccountInformationResponse;
import com.example.backend.accounts.dto.StudentInformationResponse;
import com.example.backend.accounts.dto.TeacherInformationResponse;
import com.example.backend.accounts.helper.AccountsHelper;
import com.example.backend.accounts.service.StudentService;
import com.example.backend.accounts.service.TeacherService;
import com.example.backend.auth.dto.UserInfo;

import lombok.RequiredArgsConstructor;

@RequestMapping("/accounts")
@RestController
@RequiredArgsConstructor
public class AllAccountsController {

        private final StudentService studentService;

        private final TeacherService teacherService;

        private final AccountsHelper accountsHelper;

        @GetMapping("/all")
        public ResponseEntity<List<AllAccountInformationResponse>> allAccountGet(Authentication authentication,
                        @AuthenticationPrincipal UserInfo userInfo) {
                if (authentication.getAuthorities().toString().equals("[ROLE_TEACHER]")) {
                        List<TeacherInformationResponse> teacherInfo = teacherService
                                        .findTeacherInformationResponses(userInfo.getSchoolId());
                        List<StudentInformationResponse> studentInfo = studentService
                                        .findStudentInformationResponses(userInfo.getSchoolId());
                        List<AllAccountInformationResponse> allAccountInformationResponse = accountsHelper
                                        .join(studentInfo, teacherInfo);
                        return ResponseEntity.ok(allAccountInformationResponse);
                } else {
                        List<StudentInformationResponse> studentInfo = studentService
                                        .findStudentInformationResponses(userInfo.getSchoolId());
                        List<AllAccountInformationResponse> allAccountInformationResponse = accountsHelper
                                        .join(studentInfo);
                        return ResponseEntity.ok(allAccountInformationResponse);
                }

        }
}
