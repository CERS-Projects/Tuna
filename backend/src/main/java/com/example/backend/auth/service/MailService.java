package com.example.backend.auth.service;

import com.example.backend.accounts.model.UserEntity;

public interface MailService {
    void sendMail(UserEntity userEntity, String oneTimePassword);
}
