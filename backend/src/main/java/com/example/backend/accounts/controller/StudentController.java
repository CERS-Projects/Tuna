package com.example.backend.accounts.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
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

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequestMapping("/accounts")
@RestController
@RequiredArgsConstructor
public class StudentController {

    /* StudentServiceの依存注入 */
    private final StudentService studentService;

    @Transactional
    @GetMapping("/student/information")
    public ResponseEntity<List<StudentInformationResponse>> getStudentInformation(@Valid @ModelAttribute GetFindAllStudentAccountRequest requestDto){
        List<StudentInformationResponse> responses = studentService.findStudentInformationResponses(requestDto);
        return ResponseEntity.ok(responses);
    }

    @Transactional
    @PostMapping("/student")
    public ResponseEntity<Void> createStudent(@RequestBody @Valid List<StudentCreateRequest> Dto){
         /* 基本ユーザ情報を登録する */
        List<UserEntity> savedStudentAccount = studentService.createStudent(Dto);
        /* 生徒情報を登録する */
        studentService.setStudentEnrollmentInformation(Dto, savedStudentAccount);

        return ResponseEntity.ok().build();
    }

    /* 
     * 操作されているユーザのトークンに含まれているschoolIdと
     * 実際のそのリクエストのユーザ名がschoolIdに紐づけられているユーザ名があるかどうかで整合性を検証する 
     */
    @Transactional
    @PostMapping("/student/csv-file")
    public ResponseEntity<String> createStudentByFile(@RequestPart("file") MultipartFile uploadCsvFile, @RequestParam("refId") final Integer schoolId)throws IOException{
        ResponseEntity<String> validationResult = fileValidation(uploadCsvFile);
        studentService.createStudentByFile(uploadCsvFile, schoolId);
        if(validationResult != null){
            return validationResult;
        } else {
            return ResponseEntity.ok().body("生徒アカウントの一括登録が完了しました。");
        }
    }

    @PostMapping("/student/modify")
    public ResponseEntity<Void> modifyStudentAccount(@RequestBody @Valid ModifyStudentAccountRequest dto){
        studentService.modifyStudentAccount(dto);
        return ResponseEntity.ok().build();
    }


    /* Validationパッケージに移動予定　D5,まっつん */
    public ResponseEntity<String> fileValidation(MultipartFile uploadFile){
        if(uploadFile.isEmpty()){
            return ResponseEntity.badRequest().body("ファイルが選択されていません。CSVファイルをアップロードしてください。");
        }

        String contentType = uploadFile.getContentType();
        if(contentType == null || !contentType.equals("text/csv")){
            return ResponseEntity.badRequest().body("ファイル形式が不正です。CSVファイルをアップロードしてください。");
        }

        final long MAX_CSV_SIZE = 1 * 1024 * 1024; // 1MB
        if(uploadFile.getSize() > MAX_CSV_SIZE){
            throw new IllegalArgumentException("ファイルサイズが大きすぎます。1MB以下のファイルをアップロードしてください。");
        }

        ResponseEntity<String> successValidation = null;
        return successValidation;
    }
}
