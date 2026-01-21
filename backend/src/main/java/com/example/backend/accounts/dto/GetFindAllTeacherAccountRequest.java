package com.example.backend.accounts.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetFindAllTeacherAccountRequest {
    @NotNull
    private Integer schoolId;
}
