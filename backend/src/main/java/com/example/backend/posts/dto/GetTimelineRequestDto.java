package com.example.backend.posts.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class GetTimelineRequestDto {

    private int userId;
    
    private List<String> muteWord;

    private List<Integer> shareRange;

}