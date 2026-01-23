package com.example.backend.accounts.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.accounts.dto.StudentInformationResponse;
import com.example.backend.accounts.model.StudentEntity;
import com.example.backend.group.dto.GetUserResponse;

public interface StudentRepository extends JpaRepository<StudentEntity, Integer> {
    
    /* フロントに返す用のカスタムクエリ */
    @Query ("""
            SELECT new com.example.backend.group.dto.GetUserResponse(
                user.userId,
                user.showUserId, 
                user.name,
                student.grade)
            FROM UserEntity AS user
            INNER JOIN 
            StudentEntity AS student
                ON user.userId = student.userId
            WHERE user.school.schoolId = :schoolId
            """)
    List<GetUserResponse> findAllStudentUsers(@Param("schoolId") Integer schoolId);

    @Query ("""
            SELECT new com.example.backend.accounts.dto.StudentInformationResponse(
                user.userId,
                user.showUserId, 
                user.name, 
                student.grade, 
                user.accountsStopFlag)
            FROM UserEntity AS user
            INNER JOIN 
            StudentEntity AS student
                ON user.userId = student.userId
            WHERE user.school.schoolId = :schoolId
            """)
    List<StudentInformationResponse> findAllStudentInformation(@Param("schoolId") Integer schoolId);

    @Query ("""
            SELECT userId FROM UserEntity 
            WHERE school.schoolId = :schoolId
            """)
    Set<Integer> findAllBySchoolId(@Param("schoolId") Integer schoolId);

    @Modifying
    @Transactional
    @Query("""
            UPDATE StudentEntity
            SET graduateDate = :graduateDate
            WHERE userId = :userId
            """)
    void modifyStudentAccountBySchoolId(Integer userId, LocalDate graduateDate);
}
