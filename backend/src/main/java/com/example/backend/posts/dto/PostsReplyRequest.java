package com.example.backend.posts.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.bson.types.ObjectId;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Min;


@Getter
@Setter
public class PostsReplyRequest {
    
    @NotNull
    @Min(1)
    private int currentUserId;
    
    @NotNull
    private ObjectId ReplyPostId;
    
    
    @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
    @Size(max = 20, message = "muteWords は最大20個までです")
    private List<@Size(max = 20, message = "muteWords の各要素は20文字以内です") String> muteWords;
}
