package com.example.backend.posts.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;
import org.bson.types.ObjectId;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;

import com.fasterxml.jackson.annotation.JsonFormat;


import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostInsertRequest {
    
    @NotNull
    @NotBlank
    @Size(min = 1, max = 255, message = "sentence は1-255文字以内である必要があります")
    private String sentence;

    @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
    private List<MultipartFile> imageFile;

    @NotNull
    @JsonFormat(with = JsonFormat.Feature.ACCEPT_SINGLE_VALUE_AS_ARRAY)
    private List<Integer> shareRange;
    
    private String responseTo;
    
}