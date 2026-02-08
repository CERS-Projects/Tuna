package com.example.backend.classroom.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

import com.example.backend.classroom.dto.CategoryItem;

import org.springframework.web.multipart.MultipartFile;


@Getter
@Setter
public class ClassroomUpdateRequest {

    private String roomId;

    private String roomName;

    private String description;

    private List<CategoryEditItem> updateCategories;
    private List<CategoryItem> newCategories;
    private List<String> deleteCategoryIds;

    @Getter
    @Setter
    public static class CategoryEditItem {
        private String categoryId;

        private String categoryName;

        private List<MultipartFile> newDocumentFiles;

        private List<String> deleteDocumentIds;
    }

    
    
}

