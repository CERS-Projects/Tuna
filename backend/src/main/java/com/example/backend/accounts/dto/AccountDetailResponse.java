package com.example.backend.accounts.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountDetailResponse {
    private Integer userId;
    private String showUserId;
    private String name;
    private String mailAddress;
    private Boolean accountStopFlag;

    // 生徒の場合のみ
    private Integer grade;
    private LocalDate graduateDate;

    // 教師の場合のみ
    private Boolean authority;
}
