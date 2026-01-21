package com.example.backend.accounts.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.accounts.dto.TeacherInformationResponse;
import com.example.backend.accounts.model.TeacherEntity;

public interface TeacherRepository extends JpaRepository<TeacherEntity, Integer>{
    @Query("""
            SELECT new com.example.backend.accounts.dto.TeacherInformationResponse(
                user.userId,
                user.showUserId,
                user.name,
                CASE WHEN teacher.authorityFlag = 1 THEN true ELSE false END,
                user.accountsStopFlag)
            FROM UserEntity AS user
            INNER JOIN
            TeacherEntity AS teacher
                ON user.userId = teacher.userId
            WHERE user.school.schoolId = :schoolId
            """)
    List<TeacherInformationResponse> findAllTeacherInformation(@Param("schoolId") Integer schoolId);
}
