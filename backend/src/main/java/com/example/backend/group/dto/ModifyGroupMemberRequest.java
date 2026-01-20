package com.example.backend.group.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ModifyGroupMemberRequest {
    @NotNull
    private Integer userId;
    @NotNull
    private Boolean modifiedIsJoined;
}
