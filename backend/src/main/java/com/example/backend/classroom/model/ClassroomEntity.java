package com.example.backend.classroom.model;

import org.springframework.data.mongodb.core.mapping.Field;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Getter
@Setter
@Document(collection = "classroom_collection")
public class ClassroomEntity {

    @Id
    private ObjectId id;

    @Field("school_id")
    private Integer schoolId;

    @Field("teacher_id")
    private Integer teacherId;

    @Field("room_name")
    private String roomName;

    @Field("description")
    private String description;

    @Field("latest_update")
    private Date latestUpdate;
}
