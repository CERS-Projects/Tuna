package com.example.backend.auth.service;

import java.util.List;

import org.springframework.security.core.GrantedAuthority;

import com.example.backend.accounts.model.UserEntity;
import com.example.backend.auth.dto.LoginSelectRequest;
import com.example.backend.auth.dto.LoginTokenResponse;

public interface AuthService {
    LoginTokenResponse login(LoginSelectRequest loginSelectRequest);

    void logout(Integer userId);

    LoginTokenResponse refreshTokenCheck(String refreshToken);

    List<GrantedAuthority> giveAuthority(UserEntity userEntity);

}
