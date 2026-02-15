package com.example.backend.classroom.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Date;

@Getter
@Setter
public class CategoriesResponse {

    private String categoryId;

    private String categoryName;

    private List<DocumentsResponse> documents;

    private Date createdAt;

}
