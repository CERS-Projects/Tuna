package com.example.backend.group.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DelGroupRequest {
    @NotNull
    private Integer groupId;
    
    private Integer parentId;
}
