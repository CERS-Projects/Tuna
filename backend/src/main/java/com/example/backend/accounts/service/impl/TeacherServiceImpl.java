package com.example.backend.accounts.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import com.example.backend.accounts.dto.TeacherCreateRequestInApp;
import com.example.backend.accounts.model.TeacherEntity;
import com.example.backend.accounts.model.UserEntity;
import com.example.backend.accounts.repository.TeacherRepository;
import com.example.backend.accounts.repository.UserRepository;
import com.example.backend.accounts.service.AdminUserService;
import com.example.backend.accounts.service.TeacherService;
import com.example.backend.school.dto.TeacherCreateRequestOutSideApp;
import com.example.backend.school.model.SchoolEntity;
import com.example.backend.school.repository.SchoolRepository;
import com.example.backend.accounts.helper.AccountsHelper;


/*
 * 教師アカウント作成をするためのサービス
 */
@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService, AdminUserService{

    /* UserRepositoryの依存の注入 */
    private final UserRepository userRepository;

    /* TeacherRepositoryの依存の注入 */
    private final TeacherRepository teacherRepository;

    /* ヘルパークラスの 依存の注入 */
    private final AccountsHelper accountsHelper;

    private final SchoolRepository schoolRepository;


    /*
     *　学校登録に付随する、アカウント登録に係る基本情報をMySQLに登録する機能
     */
    @Override
    @Transactional
    public UserEntity createTeacher(TeacherCreateRequestOutSideApp dto, Integer schoolId){

        SchoolEntity schoolEntity = schoolRepository.findById(schoolId)
            .orElseThrow(() -> new RuntimeException("学校が見つかりません"));
        UserEntity newTeacherAccount = accountsHelper.toUserEntity(schoolEntity, 
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

        SchoolEntity schoolEntity = accountsHelper.findSchoolEntityById(dto.getSchoolId());
        UserEntity newTeacherAccount = accountsHelper.toUserEntity(schoolEntity, 
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
        
        final Integer AUTHORITY_FLAG = 1;

        TeacherEntity newAdmin = toTeacherEntity(newTeacher, AUTHORITY_FLAG);

        /* セットした値をDBに追加 */
        teacherRepository.save(newAdmin);
    }

    /*
     * 権限フラグをなしで設定する
     */
    @Override
    @Transactional
    public void authorityNotGrant(UserEntity newTeacher){
        final Integer AUTHORITY_FLAG = 0;

        TeacherEntity newAdmin = toTeacherEntity(newTeacher, AUTHORITY_FLAG);

        /* セットした値をDBに追加 */
        teacherRepository.save(newAdmin);
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