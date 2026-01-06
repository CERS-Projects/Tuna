package com.example.backend.posts.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotNull;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostInsertRequestDto {
    @NotNull
    private int user_id;
    
    @NotNull
    private String sentence;

    private MultipartFile imageFile;

    @NotNull
    private List<Integer> shareRange;

    private String responseTo;
    
}