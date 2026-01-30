package com.example.backend.posts.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class ProfilePostsRequest {

    //jwtから取得予定
    @NotNull
    @Min(1)
    private Integer currentUserId;

    @NotNull
    @Size(min = 1,max = 11, message = "targetUserId は1-11桁以内である必要があります")
    private Integer targetUserId;

    @NotNull
    @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
    private List<Integer> groupIds;

}
