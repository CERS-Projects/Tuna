package com.example.backend.group.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetGroupRequest {
    @NotNull
    private Integer schoolId;
}
