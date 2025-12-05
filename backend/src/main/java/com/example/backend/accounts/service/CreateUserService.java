package com.example.backend.accounts.service;

import com.example.backend.accounts.dto.TeacherCreateRequestInApp;
import com.example.backend.accounts.model.UserEntity;
import com.example.backend.school.dto.TeacherCreateRequestOutSideApp;

/*
 * このインターフェースは下記機能を提供する
 * ・アカウント作成（教師、生徒関わらず）
 */
public interface CreateUserService {
    UserEntity createTeacher(TeacherCreateRequestOutSideApp dto, Integer schoolId);
    UserEntity createTeacher(TeacherCreateRequestInApp dto);
    //CreateStudentUserEntity createStudent(CreateStudentDto dto, Integer schoolId);
}
