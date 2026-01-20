package com.example.backend.group.dto;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GetGroupResponse {
    @NotNull
    private Integer groupId;

    @NotBlank
    private String groupName;

    private Integer upperGroupId;

    private List<GetGroupResponse> branchGroups = new ArrayList<>();
}
