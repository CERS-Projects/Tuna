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

    @NotNull
    @Min(1)
    private Integer currentUserId;

    @NotNull
    @Min(1)
    private Integer targetUserId;

    @NotNull
    @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
    private List<Integer> groupIds;

}
