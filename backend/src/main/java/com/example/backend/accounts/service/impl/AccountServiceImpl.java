package com.example.backend.accounts.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.accounts.dto.AccountDetailResponse;
import com.example.backend.accounts.model.StudentEntity;
import com.example.backend.accounts.model.TeacherEntity;
import com.example.backend.accounts.model.UserEntity;
import com.example.backend.accounts.repository.StudentRepository;
import com.example.backend.accounts.repository.TeacherRepository;
import com.example.backend.accounts.repository.UserRepository;
import com.example.backend.accounts.service.AccountService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;

    @Override
    @Transactional(readOnly = true)
    public AccountDetailResponse getAccountDetail(Integer userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));

        AccountDetailResponse response = new AccountDetailResponse();
        response.setUserId(user.getUserId());
        response.setShowUserId(user.getShowUserId());
        response.setName(user.getName());
        response.setMailAddress(user.getMailAddress());
        response.setAccountStopFlag(user.getAccountsStopFlag());

        if (teacherRepository.existsByUserId(userId)) {
            TeacherEntity teacher = teacherRepository.findById(userId).orElse(null);
            if (teacher != null) {
                response.setAuthority(teacher.getAuthorityFlag());
            }
        } else {
            StudentEntity student = studentRepository.findById(userId).orElse(null);
            if (student != null) {
                response.setGrade(student.getGrade());
                response.setGraduateDate(student.getGraduateDate());
            }
        }

        return response;
    }
}
