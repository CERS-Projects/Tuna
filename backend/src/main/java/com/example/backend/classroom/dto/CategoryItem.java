package com.example.backend.classroom.dto;

import com.example.backend.classroom.dto.DocumentItem;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryItem {

    private String categoryName;

    private List<DocumentItem> documents;

}
