package com.example.backend.accounts.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.backend.accounts.model.StudentEntity;
import com.example.backend.group.dto.GetUserResponse;

public interface StudentRepository extends JpaRepository<StudentEntity, Integer> {
    
    /* フロントに返す用のカスタムクエリ */
    @Query ("""
            select user.showUserId, user.name, student.grade
            from UserEntity as user
            INNER JOIN FETCH 
            StudentEntity as student
            user.userId = student.userId
            """)
    List<GetUserResponse> findAllStudentUsers();
}
