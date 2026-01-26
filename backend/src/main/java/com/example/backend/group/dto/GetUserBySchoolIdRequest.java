package com.example.backend.group.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetUserBySchoolIdRequest {
    @NotNull
    private Integer schoolId;
    @NotNull 
    private Integer groupId;
}
