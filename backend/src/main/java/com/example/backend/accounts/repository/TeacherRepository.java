package com.example.backend.accounts.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.accounts.model.TeacherEntity;

public interface TeacherRepository extends JpaRepository<TeacherEntity, Integer>{
    
}
