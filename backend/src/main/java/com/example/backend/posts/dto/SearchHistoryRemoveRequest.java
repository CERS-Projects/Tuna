package com.example.backend.posts.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Getter
@Setter
public class SearchHistoryRemoveRequest {

    //jwtから取得予定のため後ほど削除予定
    @NotNull
    @Min(1)
    private Integer userId;

    @NotNull
    @Size(min = 1, max = 20 , message = "keyword は1-20文字以内である必要があります")
    private String keyword;

}
