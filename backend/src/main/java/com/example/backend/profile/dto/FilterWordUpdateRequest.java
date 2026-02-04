package com.example.backend.profile.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter

public class FilterWordUpdateRequest {

    private List<String> filterWords;
}


