package com.example.backend.classroom.dto;

import com.example.backend.classroom.dto.CategoryItem;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClassroomInsertRequest {

    private String roomName;

    private String description;

    private List<CategoryItem> categories;

}
