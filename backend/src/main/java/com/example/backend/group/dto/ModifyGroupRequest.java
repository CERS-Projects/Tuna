package com.example.backend.group.dto;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModifyGroupRequest {

    @NotNull
    private Integer parentGroupId;

    @NotBlank
    private String groupName;

    @NotNull
    private List<@Valid ModifyGroupMemberRequest> members = new ArrayList<>();

}