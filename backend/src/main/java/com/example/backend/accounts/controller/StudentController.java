package com.example.backend.accounts.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.example.backend.accounts.dto.ModifyStudentAccountRequest;
import com.example.backend.accounts.dto.StudentCreateRequest;
import com.example.backend.accounts.model.UserEntity;
import com.example.backend.accounts.service.StudentService;
import com.example.backend.auth.dto.UserInfo;
import com.example.backend.utils.fileUtil.validation.DocumentFileValidation;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/accounts")
@RestController
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    private final DocumentFileValidation documentFileValidation;

    /* 生徒アカウントを作成する */
    @PostMapping("/student")
    public ResponseEntity<Void> createStudent(@AuthenticationPrincipal UserInfo userInfo,
            @RequestBody @Valid List<StudentCreateRequest> dto) {
        /* 基本ユーザ情報を登録する */
        List<UserEntity> savedStudentAccount = studentService.createStudent(dto, userInfo.getSchoolId());
        /* 生徒情報を登録する */
        studentService.setStudentEnrollmentInformation(dto, savedStudentAccount);
        log.info("生徒アカウントを正常に生成しました。");
        return ResponseEntity.ok().build();
    }

    /*
     * 操作されているユーザのトークンに含まれているschoolIdと
     * 実際のそのリクエストのユーザ名がschoolIdに紐づけられているユーザ名があるかどうかで整合性を検証する
     */
    @PostMapping("/student/csv-file")
    public ResponseEntity<Void> createStudentByFile(@RequestPart("file") MultipartFile uploadCsvFile,
            @AuthenticationPrincipal UserInfo userInfo) throws IOException {
        final boolean validationResult = documentFileValidation.isValidDocumentFile(uploadCsvFile);
        final boolean isCsv = documentFileValidation.isCSV(uploadCsvFile);

        if (!validationResult || !isCsv) {
            return ResponseEntity.badRequest().build();
        }
        studentService.createStudentByFile(uploadCsvFile, userInfo.getSchoolId());
        return ResponseEntity.ok().build();
    }

    /* 生徒情報を変更する */
    @PostMapping("/student/modify")
    public ResponseEntity<Void> modifyStudentAccount(@RequestBody @Valid ModifyStudentAccountRequest dto) {
        studentService.modifyStudentAccount(dto);
        return ResponseEntity.ok().build();
    }
}
