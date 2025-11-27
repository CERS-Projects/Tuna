package com.example.backend.school.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.school.model.CreateTeacherUserEntity;

public interface CreateTeacherUserRepository extends JpaRepository<CreateTeacherUserEntity, Integer>{
    
}
