package com.example.backend.accounts.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.backend.accounts.dto.GetFindAllStudentAccountRequest;
import com.example.backend.accounts.dto.ModifyStudentAccountRequest;
import com.example.backend.accounts.dto.StudentCreateRequest;
import com.example.backend.accounts.dto.StudentInformationResponse;
import com.example.backend.accounts.model.UserEntity;
import com.example.backend.group.dto.GetUserBySchoolIdRequest;
import com.example.backend.group.dto.GetUserResponse;

public interface StudentService {
    List<UserEntity> createStudent(List<StudentCreateRequest> dto, Integer schoolId);

    void setStudentEnrollmentInformation(List<StudentCreateRequest> dto, List<UserEntity> savedStudentAccount);

    void createStudentByFile(MultipartFile csvFile, final Integer schoolId) throws IOException;

    List<GetUserResponse> findAllGroups(GetUserBySchoolIdRequest dto);

    List<StudentInformationResponse> findStudentInformationResponses(Integer schoolId);

    void modifyStudentAccount(ModifyStudentAccountRequest dto);

    StudentInformationResponse findOneStudentInformationResponse(final Integer studentId);
}