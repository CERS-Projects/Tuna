package com.example.backend.classroom.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;


@Getter
@Setter
public class ClassroomUpdateRequest {

    @NotBlank
    private String roomId;
    @NotBlank
    private String roomName;
    @NotBlank
    private String description;

    private List<CategoryEditItem> updateCategories;
    private List<CategoryItem> newCategories;
    private List<String> deleteCategoryIds;

    @Getter
    @Setter
    public static class CategoryEditItem {
        @NotNull
        private String categoryId;

        @NotBlank
        private String categoryName;


        private List<MultipartFile> newDocumentFiles;

        private List<String> deleteDocumentIds;
    }

    
    
}

