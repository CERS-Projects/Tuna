package com.example.backend.posts.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class GetProfilePostRequestDto {
    private String userId;

    private List<String> groupIds;

}
