package com.example.backend.school.service;

import com.example.backend.school.dto.TeacherCreateRequest;
import com.example.backend.school.model.UserEntity;

/*
 * このインターフェースは下記機能を提供する
 * ・アカウント作成（教師、生徒関わらず）
 */
public interface CreateUserService {
    UserEntity createTeacher(TeacherCreateRequest dto, Integer schoolId);
    //CreateStudentUserEntity createStudent(CreateStudentDto dto, Integet schoolId);
}
