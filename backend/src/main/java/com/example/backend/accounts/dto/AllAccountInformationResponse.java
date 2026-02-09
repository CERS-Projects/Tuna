package com.example.backend.accounts.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class AllAccountInformationResponse {
    private Integer userId;

    private String showUserId;

    private String name;

    private Integer grade;

    private Boolean authority;

    private Boolean isAccountStopFlag;
}
