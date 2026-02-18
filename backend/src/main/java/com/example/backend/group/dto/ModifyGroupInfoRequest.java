package com.example.backend.group.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModifyGroupInfoRequest {
    private Integer newParentGroupId;

    private String newGroupName;
}
