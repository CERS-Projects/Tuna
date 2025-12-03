package com.example.backend.accounts.Service;

import com.example.backend.accounts.Model.UserEntity;

/*
 * このインターフェースは下記機能を提供する
 * ・管理者権限の付与
 */
public interface AdminUserService {
    void createAdmin(UserEntity newTeacherId, Integer authority_flag);
    void createAdmin(UserEntity newTeacher);
}
