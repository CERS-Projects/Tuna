package com.example.backend.accounts.Service.Impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.accounts.Model.TeacherEntity;
import com.example.backend.accounts.Model.UserEntity;
import com.example.backend.accounts.Repository.TeacherRepository;
import com.example.backend.accounts.Repository.UserRepository;
import com.example.backend.accounts.Service.AdminUserService;
import com.example.backend.accounts.Service.CreateUserService;
import com.example.backend.accounts.dto.TeacherCreateRequestInApp;

import com.example.backend.school.dto.TeacherCreateRequestOutSideApp;

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
     *　学校登録に付随する、アカウント登録に係る基本情報をMySQLに登録する機能
     */
    @Override
    @Transactional
    public UserEntity createTeacher(TeacherCreateRequestOutSideApp dto, Integer schoolId){

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
     *　ウェブアプリ内からの教師アカウント作成機能を提供する
     */
    @Override
    @Transactional
    public UserEntity createTeacher(TeacherCreateRequestInApp dto){
        
        Integer schoolId = dto.getSchoolId();
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
        newAdmin.setTeacherAccountId(newTeacher);
        /* 権限ありで設定する */
        newAdmin.setAuthorityFlag(authorityFlag);

        /* セットした値をDBに追加 */
        adminRepository.save(newAdmin);
    }

    /*
     * 権限フラグをなしで設定する
     */
    @Override
    @Transactional
    public void createAdmin(UserEntity newTeacher){
        
        TeacherEntity newTeacherEntity = new TeacherEntity();

        /* エンティティに値をセット */
        newTeacherEntity.setTeacherAccountId(newTeacher);
        /* 権限無しで登録する */
        newTeacherEntity.setAuthorityFlag(0);

        /* セットした値をDBに追加 */
        adminRepository.save(newTeacherEntity);
    }


}
