package com.example.backend.accounts.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.example.backend.accounts.dto.StudentCreateRequest;
import com.example.backend.accounts.model.UserEntity;

public interface StudentService {
    UserEntity createStudent(StudentCreateRequest dto);
    void setStudentEnrollmentInformation(StudentCreateRequest dto, UserEntity savedStudentAccount);
    void createStudentByFile(MultipartFile csvFile, final Integer schoolId) throws IOException;
}