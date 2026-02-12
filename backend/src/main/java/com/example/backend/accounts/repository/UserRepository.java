package com.example.backend.accounts.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.accounts.dto.GetUserName;
import com.example.backend.accounts.model.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
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

        Optional<UserEntity> findByShowUserId(String showUserId);

        @Query("""
                        SELECT u.name as name, u.showUserId as showUserId
                        FROM UserEntity u
                        WHERE u.userId = :userId
                        """)
        Optional<GetUserName> findUserInfo(@Param("userId") Integer userId);

        boolean existsByShowUserId(String showUserId);

        @Query("""
                        SELECT COUNT(u.userId) FROM UserEntity u
                        WHERE u.school.schoolId = :schoolId
                            AND (u.userId = :userId OR u.userId = :reportedUserId)
                        """)
        long validateByReportBySchoolId(@Param("schoolId") Integer schoolId,
                        @Param("userId") Integer userId,
                        @Param("reportedUserId") Integer reportedUserId);

        // ユーザーのshowUserIdと名前を取得する
        @Query("SELECT u.showUserId as showUserId, u.name as name " +
                        "FROM UserEntity u WHERE u.userId = :userId")
        GetUserName findUserName(@Param("userId") Integer userId);

        UserEntity findByMailAddress(String mailAddress);

}
