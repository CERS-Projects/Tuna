package com.example.backend.posts.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.bson.types.ObjectId;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import com.fasterxml.jackson.annotation.JsonFormat;


@Getter
@Setter
public class PostsReplyRequest {
    //jwtから取得予定
    @NotNull
    @Min(1)
    private int currentUserId;
    
    @NotNull
    @Size(min = 24, max = 24, message = "replyPostId は24文字である必要があります")
    private ObjectId replyPostId;
    
    
    @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
    @Size(max = 20, message = "muteWords は最大20個までです")
    private List<@Size(min = 1, max = 20, message = "muteWords の各要素は1-20文字以内です") String> muteWords;
}
