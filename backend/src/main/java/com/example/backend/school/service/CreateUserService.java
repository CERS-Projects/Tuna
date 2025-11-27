package com.example.backend.school.service;

import com.example.backend.school.dto.CreateTeacherDto;
import com.example.backend.school.model.CreateTeacherUserEntity;

/*
 * このインターフェースは下記機能を提供する
 * ・アカウント作成（教師、生徒関わらず）
 */
public interface CreateUserService {
    CreateTeacherUserEntity createTeacher(CreateTeacherDto dto, Integer schoolId);
    //CreateStudentUserEntity createStudent(CreateStudentDto dto, Integet schoolId);
}
