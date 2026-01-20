package com.example.backend.group.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetUserResponse {
    @NotBlank
    private String showUserId;
    @NotBlank
    private String userName;
    @NotNull
    private Integer grade;
    @NotNull
    private Boolean isJoin = false;

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
