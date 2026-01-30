package com.example.backend.accounts.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.accounts.model.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Integer>{
    @Modifying
    @Transactional
    @Query("""
            UPDATE UserEntity
            SET name = :name,
                mailAddress = :mailAddress,
                accountsStopFlag = :accountStopFlag
            WHERE userId = :userId
            """)
    void modifyBasicInformationByUserId(@Param("userId") Integer userId, @Param("name") String name,
                                        @Param("mailAddress") String mailAddress, @Param("accountStopFlag") Boolean accountStopFlag);

    @Query("""
            SELECT EXISTS(
                SELECT userId FROM UserEntity
                WHERE school.schoolId = :schoolId AND userId = :userId
            )
            """)
    Boolean existsByUserIdAndSchoolId(@Param("userId") Integer userId, @Param("schoolId") Integer schoolId);

    @Query("""
            SELECT u.name,u.showUserId FROM UserEntity u
            WHERE u.userId = :userId
            """)
    Object[] findNameShowUserIdByUserId(@Param("userId") Integer userId);

    Optional<UserEntity> findByShowUserId(String showUserId);

    boolean existsByShowUserId(String showUserId);

    @Query("""
           SELECT COUNT(u.userId) FROM UserEntity u
           WHERE u.school.schoolId = :schoolId 
               AND (u.userId = :userId OR u.userId = :reportedUserId)
           """)
    long validateByReportBySchoolId(@Param("schoolId") Integer schoolId, 
                                    @Param("userId") Integer userId, 
                                    @Param("reportedUserId") Integer reportedUserId);
}
