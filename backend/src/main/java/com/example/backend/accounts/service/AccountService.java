package com.example.backend.accounts.service;

import com.example.backend.accounts.dto.AccountDetailResponse;

public interface AccountService {
    AccountDetailResponse getAccountDetail(Integer userId);
}
