package com.example.backend.accounts.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.accounts.Model.UserEntity;
import com.example.backend.accounts.Service.AdminUserService;
import com.example.backend.accounts.Service.CreateUserService;

import com.example.backend.accounts.dto.TeacherCreateRequestInApp;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/api/account")
@RestController
@RequiredArgsConstructor
public class TeacherController {

    /* 依存の注入 */
    private final CreateUserService createUserService;
    private final AdminUserService adminUserService;

    @PostMapping("/create")
    public ResponseEntity<Void> createTeacher(@RequestBody @Valid TeacherCreateRequestInApp requestDto){

        UserEntity newTeacherAccount = new UserEntity();

        /* 教師アカウントの作成 */
        newTeacherAccount = createUserService.createTeacher(requestDto);
        
        /* 権限の設定(権限無し) */
        
        adminUserService.createAdmin(newTeacherAccount);

        return ResponseEntity.ok().build();
    }
}
