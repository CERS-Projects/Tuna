package com.example.backend.posts.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import org.bson.types.ObjectId;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;

import com.fasterxml.jackson.annotation.JsonFormat;


import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostInsertRequest {
    @NotNull
    @Min(1)
    private Integer user_id;
    
    @NotNull
    @NotBlank
    @Size(max = 200 ,min = 1)
    private String sentence;

    @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
    private List<MultipartFile> imageFile;

    @NotNull
    @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
    private List<Integer> shareRange;
    
    private String responseTo;
    
}