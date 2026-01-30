package com.example.backend.posts.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonFormat;

@Getter
@Setter
public class TimelinePostsRequest {

    @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
    @Size(max = 20, message = "muteWords は最大20個までです")
    private List<@Size(min = 1, max = 20, message = "muteWords の各要素は1-20文字以内です") String> muteWords;

    @NotNull
    @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
    private List<Integer> shareRange;

    //jwtから取得するためダミー項目
    private int userId;



}