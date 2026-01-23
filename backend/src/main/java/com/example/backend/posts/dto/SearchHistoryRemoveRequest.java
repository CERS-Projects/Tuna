package com.example.backend.posts.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Getter
@Setter
public class SearchHistoryRemoveRequest {

    @NotNull
    private Integer userId;

    @NotNull
    private String keyword;

}
