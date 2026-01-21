package com.example.backend.accounts.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class StudentInformationResponse {
    private Integer userId;

    private String showUserId;

    private String name;

    private Integer grade;
    
    private Boolean isAccountStopFlag;
}
