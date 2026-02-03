package com.example.backend.auth.service;

import java.util.List;

import org.springframework.security.core.GrantedAuthority;

import com.example.backend.accounts.model.UserEntity;
import com.example.backend.auth.dto.LoginSelectRequest;

public interface AuthService {
    String login(LoginSelectRequest loginSelectRequest);

    void logout(Integer userId);

    List<GrantedAuthority> giveAuthority(UserEntity userEntity);

}
