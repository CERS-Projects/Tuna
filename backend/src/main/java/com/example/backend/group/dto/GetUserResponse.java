package com.example.backend.group.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetUserResponse {
    private String showUserId;

    private String userName;
    
    private Integer grade;
    
    private Boolean isJoin;

    public GetUserResponse(String showUserId, String userName, Integer grade) {
        this.showUserId = showUserId;
        this.userName = userName;
        this.grade = grade;
    }

    public GetUserResponse(String showUserId, String userName, Integer grade, Boolean isJoin) {
        this.showUserId = showUserId;
        this.userName = userName;
        this.grade = grade;
        this.isJoin = isJoin;
    }
}
