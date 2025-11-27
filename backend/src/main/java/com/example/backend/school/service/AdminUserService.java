package com.example.backend.school.service;

import com.example.backend.school.model.CreateTeacherUserEntity;

/*
 * このインターフェースは下記機能を提供する
 * ・管理者権限の付与
 */
public interface AdminUserService {
    void createAdmin(CreateTeacherUserEntity newTeacherId, Integer authority_flag);
}
