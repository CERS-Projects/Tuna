package com.example.backend.utils.accountConfirm;

import org.springframework.stereotype.Component;

import com.example.backend.accounts.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AccountConfirm {
    private final UserRepository userRepository;
    public Boolean existsByUserIdBySchoolId(Integer userId, Integer schoolId) {
        return userRepository.existsByUserIdAndSchoolId(userId, schoolId);
    }
}
