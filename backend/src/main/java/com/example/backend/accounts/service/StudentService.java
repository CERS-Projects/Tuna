package com.example.backend.accounts.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.backend.accounts.dto.StudentCreateRequest;
import com.example.backend.accounts.dto.StudentInformationResponses;
import com.example.backend.accounts.model.UserEntity;
import com.example.backend.group.dto.GetUserBySchoolId;
import com.example.backend.group.dto.GetUserResponse;

public interface StudentService {
    UserEntity createStudent(StudentCreateRequest dto);
    void setStudentEnrollmentInformation(StudentCreateRequest dto, UserEntity savedStudentAccount);
    void createStudentByFile(MultipartFile csvFile, final Integer schoolId) throws IOException;
    List<GetUserResponse> findAllGroup(GetUserBySchoolId dto);
    List<StudentInformationResponses> findStudentInformationResponses();
}