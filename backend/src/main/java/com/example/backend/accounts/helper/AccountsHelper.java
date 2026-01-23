package com.example.backend.accounts.helper;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.backend.accounts.model.UserEntity;
import com.example.backend.school.model.SchoolEntity;
import com.example.backend.school.repository.SchoolRepository;

import lombok.RequiredArgsConstructor;

/*
 * DtoとEntityの変換部分の共通部分の処理(Helper method)
 */
@Component
@RequiredArgsConstructor
public class AccountsHelper {
    
    private final PasswordEncoder passwordEncoder;

    private final SchoolRepository schoolRepository;

    /* UserEntityに変換 */
    public UserEntity toUserEntity(SchoolEntity schoolEntity, String showUserId, String password, String mailAddress, String name){
        
        UserEntity newUserAccount = new UserEntity();
        String digest = passwordEncoder.encode(password);

        newUserAccount.setSchool(schoolEntity);
        newUserAccount.setShowUserId(showUserId);
        newUserAccount.setPassword(digest);
        newUserAccount.setMailAddress(mailAddress);
        newUserAccount.setName(name);

        return newUserAccount;
    }

    /* 学校IDから参照先のSchoolEntityを取得 */
    public SchoolEntity findSchoolEntityById(Integer schoolId){
        SchoolEntity schoolEntity = schoolRepository.findById(schoolId)
                                                    .orElseThrow(()-> new RuntimeException("指定された学校IDは存在しません"));
        return schoolEntity;
    }
}
