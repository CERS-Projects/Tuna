package com.example.backend.accounts.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import com.example.backend.accounts.dto.TeacherCreateRequestInApp;
import com.example.backend.accounts.model.TeacherEntity;
import com.example.backend.accounts.model.UserEntity;
import com.example.backend.accounts.repository.TeacherRepository;
import com.example.backend.accounts.repository.UserRepository;
import com.example.backend.accounts.service.AdminUserService;
import com.example.backend.accounts.service.CreateUserService;
import com.example.backend.school.dto.TeacherCreateRequestOutSideApp;


/*
 * 教師アカウント作成をするためのサービス
 */
@Service
@RequiredArgsConstructor
public class CreateTeacherUserServiceImpl implements CreateUserService, AdminUserService{

    /* UserRepositoryの依存の注入 */
    private final UserRepository userRepository;

    /* TeacherRepositoryの依存の注入 */
    private final TeacherRepository teacherRepository;

    /* BCryptを使用できるようにする */
    private final PasswordEncoder passwordEncoder;


    /*
     *　学校登録に付随する、アカウント登録に係る基本情報をMySQLに登録する機能
     */
    @Override
    @Transactional
    public UserEntity createTeacher(TeacherCreateRequestOutSideApp dto, Integer schoolId){

        UserEntity newTeacherAccount = new UserEntity();

        newTeacherAccount = toUserEntity(schoolId, 
                                            dto.getShowUserId(),
                                            dto.getName(),
                                            dto.getMailAddress(),
                                            dto.getPassword()
                                            );

        /* セットした値をDBに追加 */
        UserEntity savedTeacherEntity = userRepository.save(newTeacherAccount);
        return savedTeacherEntity;
    }

    /*
     *　ウェブアプリ内からの教師アカウント作成機能を提供する
     */
    @Override
    @Transactional
    public UserEntity createTeacher(TeacherCreateRequestInApp dto){
        
        UserEntity newTeacherAccount = new UserEntity();

        newTeacherAccount = toUserEntity(dto.getSchoolId(), 
                                            dto.getShowUserId(),
                                            dto.getName(),
                                            dto.getMailAddress(),
                                            dto.getPassword()
                                            );
        /* セットした値をDBに追加 */
        UserEntity savedTeacherEntity = userRepository.save(newTeacherAccount);
        return savedTeacherEntity;
    }


    /* 
     *  管理者権限あり状態を登録する機能
     */
    @Override
    @Transactional
    public void authorityGrant(UserEntity newTeacher){
        
        TeacherEntity newAdmin = new TeacherEntity();
        final Integer AUTHORITY_FLAG = 1;

        newAdmin = toTeacherEntity(newTeacher, AUTHORITY_FLAG);

        /* セットした値をDBに追加 */
        teacherRepository.save(newAdmin);
    }

    /*
     * 権限フラグをなしで設定する
     */
    @Override
    @Transactional
    public void authorityNotGrant(UserEntity newTeacher){
        
        TeacherEntity newadmin = new TeacherEntity();
        final Integer AUTHORITY_FLAG = 0;

        newadmin = toTeacherEntity(newTeacher, AUTHORITY_FLAG);

        /* セットした値をDBに追加 */
        teacherRepository.save(newadmin);
    }

    /*
     * DtoとEntityの変換部分の共通部分の処理(Helper method)
     */

    /* UserEntityに変換 */
    private UserEntity toUserEntity(Integer schoolId, String showUserId, String name, String mailAddress, String password){
       
        UserEntity newTeacherAccount = new UserEntity();
        String digest = passwordEncoder.encode(password);

        newTeacherAccount.setSchoolId(schoolId);
        newTeacherAccount.setShowUserId(showUserId);
        newTeacherAccount.setName(name);
        newTeacherAccount.setPassword(digest);
        newTeacherAccount.setMailAddress(mailAddress);

        return newTeacherAccount;
    }

    /* TeacherEntityに変換 */
    private TeacherEntity toTeacherEntity(UserEntity newTeacher, Integer AuthorityFlag){
        TeacherEntity newTeacherEntity = new TeacherEntity();
        /* エンティティに値をセット */
        newTeacherEntity.setTeacherAccountId(newTeacher);
        /* 権限の登録*/
        newTeacherEntity.setAuthorityFlag(AuthorityFlag);

        return newTeacherEntity;
    }

}