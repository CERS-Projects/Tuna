package com.example.backend.accounts.helper;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.backend.accounts.model.UserEntity;

import lombok.RequiredArgsConstructor;

/*
 * DtoとEntityの変換部分の共通部分の処理(Helper method)
 */
@Component
@RequiredArgsConstructor
public class AccountsHelper {
    
    private final PasswordEncoder passwordEncoder;

    /* UserEntityに変換 */
    public UserEntity toUserEntity(Integer schoolId, String showUserId, String name, String mailAddress, String password){
        
        UserEntity newUserAccount = new UserEntity();
        String digest = passwordEncoder.encode(password);

        newUserAccount.setSchoolId(schoolId);
        newUserAccount.setShowUserId(showUserId);
        newUserAccount.setName(name);
        newUserAccount.setPassword(digest);
        newUserAccount.setMailAddress(mailAddress);

        return newUserAccount;
    }
}
