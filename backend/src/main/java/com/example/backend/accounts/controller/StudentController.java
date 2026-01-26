package com.example.backend.accounts.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.accounts.dto.GetFindAllStudentAccountRequest;
import com.example.backend.accounts.dto.ModifyStudentAccountRequest;
import com.example.backend.accounts.dto.StudentCreateRequest;
import com.example.backend.accounts.dto.StudentInformationResponse;
import com.example.backend.accounts.model.UserEntity;
import com.example.backend.accounts.service.StudentService;
import com.example.backend.utils.fileUtil.validation.DocumentFileValidation;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequestMapping("/accounts")
@RestController
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    private final DocumentFileValidation documentFileValidation;

    /* 生徒情報を取得する */
    @GetMapping("/student/all/information")
    public ResponseEntity<List<StudentInformationResponse>> getStudentInformation(@Valid @ModelAttribute GetFindAllStudentAccountRequest dto){
        List<StudentInformationResponse> responses = studentService.findStudentInformationResponses(dto);
        return ResponseEntity.ok(responses);
    }

    /* 特定のstudentIdに紐づく生徒情報を1件取得する */
    @GetMapping("/student/{studentId}/information")
    public ResponseEntity<StudentInformationResponse> getOneStudentInformation(@Valid @ModelAttribute final Integer studentId){
        StudentInformationResponse response = studentService.findOneStudentInformationResponse(studentId);
        return ResponseEntity.ok(response);
    }

    /* 生徒アカウントを作成する */
    @PostMapping("/student")
    public ResponseEntity<Void> createStudent(@RequestBody @Valid List<StudentCreateRequest> dto){
         /* 基本ユーザ情報を登録する */
        List<UserEntity> savedStudentAccount = studentService.createStudent(dto);
        /* 生徒情報を登録する */
        studentService.setStudentEnrollmentInformation(dto, savedStudentAccount);
        return ResponseEntity.ok().build();
    }

    /* 
     * 操作されているユーザのトークンに含まれているschoolIdと
     * 実際のそのリクエストのユーザ名がschoolIdに紐づけられているユーザ名があるかどうかで整合性を検証する 
     */
    @PostMapping("/student/csv-file")
    public ResponseEntity<String> createStudentByFile(@RequestPart("file") MultipartFile uploadCsvFile, @RequestParam("refId") final Integer schoolId)throws IOException{
        final boolean validationResult = documentFileValidation.isValidDocumentFile(uploadCsvFile);
        final boolean isCsv = documentFileValidation.isCSV(uploadCsvFile);

        if(!validationResult || !isCsv){
            return ResponseEntity.badRequest().body("CSVファイルの形式が正しいこと、ファイルの上限内であること、内容が正しいかどうか確認してください。");
        }
        studentService.createStudentByFile(uploadCsvFile, schoolId);
        return ResponseEntity.ok().body("アカウントを正常に生成しました。");
    }

    /* 生徒情報を変更する */
    @PostMapping("/student/modify")
    public ResponseEntity<Void> modifyStudentAccount(@RequestBody @Valid ModifyStudentAccountRequest dto){
        studentService.modifyStudentAccount(dto);
        return ResponseEntity.ok().build();
    }
}
