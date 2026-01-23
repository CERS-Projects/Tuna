package com.example.backend.accounts.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
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
    void modifyBasicInformationBySchoolId(Integer userId, String name,
                                        String mailAddress, Boolean accountStopFlag);

    @Query("""
            SELECT EXISTS(
                SELECT userId FROM UserEntity
                WHERE school.schoolId = :schoolId AND userId = :userId
            )
            """)
    Boolean existsByUserIdAndSchoolId(Integer userId, Integer schoolId);
}
