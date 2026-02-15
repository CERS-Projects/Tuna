package com.example.backend.classroom.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import com.example.backend.classroom.dto.CategoriesResponse;
import org.springframework.data.mongodb.core.mapping.Field;
@Getter
@Setter
public class ClassroomDetailResponse {

    private String classroomId;

    @Field("room_name")
    private String roomName;

    private String description;

    private List<CategoriesResponse> categories;

    

}
