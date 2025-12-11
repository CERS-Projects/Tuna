package com.example.backend.accounts.controller;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.accounts.dto.StudentCreateRequest;
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

    @PostMapping("/student")
    public ResponseEntity<Void> createStudent(@RequestBody @Valid StudentCreateRequest requestDto){
        UserEntity savedStudentAccount = new UserEntity(); 

        /* 基本ユーザ情報を登録する */
        savedStudentAccount = studentService.createStudent(requestDto);
        /* 生徒情報を登録する */
        studentService.setStudentEnrollmentInformation(requestDto,savedStudentAccount);

        return ResponseEntity.ok().build();
    }

    /* 
     * 操作されているユーザのトークンに含まれているschoolIdと
     * 実際のそのリクエストのユーザ名がschoolIdに紐づけられているユーザ名があるかどうかで整合性を検証する 
     */
    @PostMapping("/by-file")
    public ResponseEntity<String> createStudentByFile(@RequestPart("file") MultipartFile uploadCsvFile, @RequestParam("refId") final Integer schoolId){

        if(uploadCsvFile.isEmpty()){
            return ResponseEntity.badRequest().build();
        }
        try{
            studentService.createStudentByFile(uploadCsvFile,schoolId);
            return ResponseEntity.ok().build();
        } catch (IOException ioException) {
            return ResponseEntity.status(500).body("ioException" + ioException.getMessage());
        } catch (Exception exception) {
            return ResponseEntity.status(400).body("otherException" + exception.getMessage());
        }
    }
}
