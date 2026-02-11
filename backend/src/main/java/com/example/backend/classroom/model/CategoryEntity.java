package com.example.backend.classroom.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Getter
@Setter
@Document(collection = "classroom_category_collection")
public class CategoryEntity {

    @Id
    private ObjectId id;

    @Field("classroom_id")
    private ObjectId classroomId;

    @Field("categoryname")
    private String categoryName;

    @Field("created_date")
    private Date createdDate;

}
