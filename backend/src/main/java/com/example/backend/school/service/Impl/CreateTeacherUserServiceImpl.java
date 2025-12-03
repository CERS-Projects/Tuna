package com.example.backend.school.service.Impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.school.dto.TeacherCreateRequest;
import com.example.backend.school.model.TeacherEntity;
import com.example.backend.school.model.UserEntity;
import com.example.backend.school.repository.TeacherRepository;
import com.example.backend.school.repository.UserRepository;
import com.example.backend.school.service.AdminUserService;
import com.example.backend.school.service.CreateUserService;

import lombok.RequiredArgsConstructor;

/*
 * 教師アカウント作成をするためのサービス
 */
@Service
@RequiredArgsConstructor
public class CreateTeacherUserServiceImpl implements CreateUserService, AdminUserService{

    /* CreateTeacherRepositoryの依存の注入 */
    private final UserRepository teacherRepository;

    /* CreateAdminRepositoryの依存の注入 */
    private final TeacherRepository adminRepository;

    /* BCryptのエンコーダーの依存の注入 */
    private final PasswordEncoder passwordEncoder;

    /*
     *　アカウント登録に係る基本情報をMySQLに登録する機能
     */
    @Override
    @Transactional
    public UserEntity createTeacher(TeacherCreateRequest dto, Integer schoolId){

        UserEntity newTeacherAccount = new UserEntity();

        /* パスワードをハッシュ化 */
        String digest = passwordEncoder.encode(dto.getPassword());

        /* Entityクラスに値をセット */
        newTeacherAccount.setSchoolId(schoolId);
        newTeacherAccount.setShowUserId(dto.getShowUserId());
        newTeacherAccount.setName(dto.getName());
        newTeacherAccount.setPassword(digest);
        newTeacherAccount.setMailAddress(dto.getMailAddress());

        /* セットした値をDBに追加 */
        UserEntity savedTeacherEntity = teacherRepository.save(newTeacherAccount);
        return savedTeacherEntity;
    }

    /* 
     *  管理者権限あり状態を登録する機能
     */
    @Override
    @Transactional
    public void createAdmin(UserEntity newTeacher, Integer authorityFlag){
        
        TeacherEntity newAdmin = new TeacherEntity();

        /* エンティティに値をセット */
        newAdmin.setTeacherAccount(newTeacher);
        newAdmin.setAuthorityFlag(authorityFlag);

        /* セットした値をDBに追加 */
        adminRepository.save(newAdmin);
    }


}
