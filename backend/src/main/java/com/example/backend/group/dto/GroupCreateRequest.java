package com.example.backend.group.dto;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GroupCreateRequest {
    @NotNull
    private Integer schoolId;

    @NotBlank
    private String groupName;

    private Integer parentGroupId;
    
    @NotNull
    private List<Integer> membersUserId = new ArrayList<>();
}