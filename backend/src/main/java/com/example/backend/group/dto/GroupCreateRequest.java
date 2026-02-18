package com.example.backend.group.dto;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GroupCreateRequest {
    @NotBlank
    private String groupName;

    private Integer parentGroupId;

    private List<Integer> membersUserId = new ArrayList<>();
}