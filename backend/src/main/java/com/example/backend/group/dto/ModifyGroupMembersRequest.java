package com.example.backend.group.dto;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ModifyGroupMembersRequest {

    @NotNull
    private Integer parentGroupId;

    private List<@Valid ModifyGroupMemberRequest> members = new ArrayList<>();

}
