package com.example.backend.group.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModifyUpperGroupRequest {
    @NotNull
    private Integer groupId;

    private Integer newParentGroupId;
}
