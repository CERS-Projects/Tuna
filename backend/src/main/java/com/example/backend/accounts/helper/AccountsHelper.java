package com.example.backend.accounts.helper;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.backend.accounts.dto.AllAccountInformationResponse;
import com.example.backend.accounts.dto.StudentInformationResponse;
import com.example.backend.accounts.dto.TeacherInformationResponse;
import com.example.backend.accounts.model.UserEntity;
import com.example.backend.school.model.SchoolEntity;
import com.example.backend.school.repository.SchoolRepository;

import lombok.RequiredArgsConstructor;

/*
 * DtoとEntityの変換部分の共通部分の処理(Helper method)
 */
@Component
@RequiredArgsConstructor
public class AccountsHelper {

    private final PasswordEncoder passwordEncoder;

    private final SchoolRepository schoolRepository;

    /* UserEntityに変換 */
    public UserEntity toUserEntity(SchoolEntity schoolEntity, String showUserId, String password, String mailAddress,
            String name) {

        UserEntity newUserAccount = new UserEntity();
        String digest = passwordEncoder.encode(password);

        newUserAccount.setSchool(schoolEntity);
        newUserAccount.setShowUserId(showUserId);
        newUserAccount.setPassword(digest);
        newUserAccount.setMailAddress(mailAddress);
        newUserAccount.setName(name);

        return newUserAccount;
    }

    /* 学校IDから参照先のSchoolEntityを取得 */
    public SchoolEntity findSchoolEntityById(Integer schoolId) {
        SchoolEntity schoolEntity = schoolRepository.findById(schoolId)
                .orElseThrow(() -> new RuntimeException("指定された学校IDは存在しません"));
        return schoolEntity;
    }

    // 先生と生徒情報を一つにまとめる
    public List<AllAccountInformationResponse> join(List<StudentInformationResponse> listStudent,
            List<TeacherInformationResponse> listTeacher) {
        List<AllAccountInformationResponse> allAccountInformationResponseList = new ArrayList<>();
        for (Integer i = 0; i < listStudent.size(); i++) {
            StudentInformationResponse studentInformationResponse = listStudent.get(i);
            AllAccountInformationResponse allAccountInformationResponse = new AllAccountInformationResponse(
                    studentInformationResponse.getUserId(), studentInformationResponse.getShowUserId(),
                    studentInformationResponse.getName(), studentInformationResponse.getGrade(),
                    null,
                    studentInformationResponse.getIsAccountStopFlag());
            allAccountInformationResponseList.add(allAccountInformationResponse);
        }
        for (Integer i = 0; i < listTeacher.size(); i++) {
            TeacherInformationResponse teacherInformationResponse = listTeacher.get(i);
            AllAccountInformationResponse allAccountInformationResponse = new AllAccountInformationResponse(
                    teacherInformationResponse.getUserId(), teacherInformationResponse.getShowUserId(),
                    teacherInformationResponse.getName(), null,
                    teacherInformationResponse.getAuthority(),
                    teacherInformationResponse.getIsAccountStopFlag());
            allAccountInformationResponseList.add(allAccountInformationResponse);
        }
        return allAccountInformationResponseList;
    }

    public List<AllAccountInformationResponse> join(List<StudentInformationResponse> listStudent) {
        List<AllAccountInformationResponse> allAccountInformationResponseList = new ArrayList<>();
        for (Integer i = 0; i < listStudent.size(); i++) {
            StudentInformationResponse studentInformationResponse = listStudent.get(i);
            AllAccountInformationResponse allAccountInformationResponse = new AllAccountInformationResponse(
                    studentInformationResponse.getUserId(), studentInformationResponse.getShowUserId(),
                    studentInformationResponse.getName(), studentInformationResponse.getGrade(),
                    null,
                    studentInformationResponse.getIsAccountStopFlag());
            allAccountInformationResponseList.add(allAccountInformationResponse);
        }
        return allAccountInformationResponseList;
    }
}
