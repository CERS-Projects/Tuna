package com.example.backend.classroom.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Getter
@Setter
public class ClassroomsResponse {

    private String roomId;

    private String roomName;

    private String teacherName;

    private String description;

    private Date latestUpdate;
}
