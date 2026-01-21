package com.example.backend.accounts.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TeacherInformationResponse {
    private Integer userId;

    private String showUserId;

    private String name;

    private Boolean isAdmin;
    
    private Boolean isAccountStopFlag;
}
