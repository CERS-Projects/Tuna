package com.example.backend.accounts.service;

import java.util.List;

import com.example.backend.accounts.dto.GetFindAllTeacherAccountRequest;
import com.example.backend.accounts.dto.ModifyTeacherAccountRequest;
import com.example.backend.accounts.dto.TeacherCreateRequestInApp;
import com.example.backend.accounts.dto.TeacherInformationResponse;
import com.example.backend.accounts.model.UserEntity;
import com.example.backend.school.dto.TeacherCreateRequestOutSideApp;

/*
 * このインターフェースは下記機能を提供する
 * ・アカウント作成（教師、生徒関わらず）
 */
public interface TeacherService {
    UserEntity createTeacher(TeacherCreateRequestOutSideApp dto, Integer schoolId);
    UserEntity createTeacher(TeacherCreateRequestInApp dto);
    List<TeacherInformationResponse> findTeacherInformationResponses(GetFindAllTeacherAccountRequest dto);
    void ModifyTeacherAccountBySchoolId(ModifyTeacherAccountRequest dto);
}
