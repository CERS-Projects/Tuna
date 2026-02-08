package com.example.backend.classroom.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

import com.example.backend.classroom.service.ClassroomService;
import com.example.backend.classroom.dto.ClassroomInsertRequest;
import com.example.backend.classroom.dto.ClassroomsResponse;
import com.example.backend.classroom.dto.ClassroomDetailResponse;
import com.example.backend.classroom.dto.ClassroomUpdateRequest;

import java.util.List;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.example.backend.auth.dto.UserInfo;
import org.springframework.http.MediaType;

@RestController
@RequiredArgsConstructor
@RequestMapping("/classroom")
public class ClassroomController {

    private final ClassroomService classroomService;

    //クラスルーム作成
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> createClassroom(@ModelAttribute @Valid ClassroomInsertRequest requestDto, @AuthenticationPrincipal UserInfo userInfo) {
        classroomService.createClassroomWithCategoriesAndDocuments(requestDto, userInfo.getSchoolId(), userInfo.getUserId());
        return ResponseEntity.ok().build();
    
    }

    //クラスルーム一覧取得
    @GetMapping("/list")
    public ResponseEntity<List<ClassroomsResponse>> getClassrooms(@AuthenticationPrincipal UserInfo userInfo) {
        List<ClassroomsResponse> classrooms = classroomService.getClassroomsBySchoolId(userInfo.getSchoolId());
        return ResponseEntity.ok().body(classrooms);
    }

    //クラスルーム詳細取得
    @GetMapping("/detail")
    public ResponseEntity<ClassroomDetailResponse> getClassroomDetails(@AuthenticationPrincipal UserInfo userInfo, String roomId) {
        ClassroomDetailResponse classroomDetail = classroomService.getClassroomDetails(roomId, userInfo.getSchoolId());
        return ResponseEntity.ok().body(classroomDetail);
    }

    //クラスルームの更新
    @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> updateClassroom(@ModelAttribute @Valid ClassroomUpdateRequest classroomUpdateRequest, @AuthenticationPrincipal UserInfo userInfo) {
        classroomService.updateClassroom(classroomUpdateRequest, userInfo.getSchoolId());
        return ResponseEntity.ok().build();
    }

    //クラスルームの削除
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteClassroom(@AuthenticationPrincipal UserInfo userInfo, String roomId) {
        classroomService.deleteClassroom(roomId, userInfo.getSchoolId());
        return ResponseEntity.ok().build();
    }
}

