package com.example.backend.classroom.service;

import java.util.List;

import com.example.backend.classroom.dto.ClassroomInsertRequest;
import com.example.backend.classroom.dto.ClassroomsResponse;
import com.example.backend.classroom.dto.ClassroomDetailResponse;
import com.example.backend.classroom.dto.ClassroomUpdateRequest;

public interface ClassroomService {


    void createClassroomWithCategoriesAndDocuments (ClassroomInsertRequest classroomInsertRequest, Integer schoolId, Integer teacherId);

    List<ClassroomsResponse> getClassroomsBySchoolId(Integer schoolId);

    ClassroomDetailResponse getClassroomDetails(String roomId, Integer schoolId);

    void updateClassroom(ClassroomUpdateRequest classroomUpdateRequest, Integer schoolId);

    void deleteClassroom(String roomId, Integer schoolId);
}
