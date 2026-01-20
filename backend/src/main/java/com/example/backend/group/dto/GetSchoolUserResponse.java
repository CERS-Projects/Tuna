package com.example.backend.group.dto;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GetSchoolUserResponse {
    
    private List<@Valid GetUserResponse> users = new ArrayList<>();
}
