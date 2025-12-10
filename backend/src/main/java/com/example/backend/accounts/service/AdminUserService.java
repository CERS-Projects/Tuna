package com.example.backend.accounts.service;

import com.example.backend.accounts.model.UserEntity;

/*
 * このインターフェースは下記機能を提供する
 * ・管理者権限の付与
 */
public interface AdminUserService {
    void authorityGrant(UserEntity newTeacherId);
    void authorityNotGrant(UserEntity newTeacherAccount);
}
