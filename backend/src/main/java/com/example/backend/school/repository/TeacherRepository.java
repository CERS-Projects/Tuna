package com.example.backend.school.repository;

import com.example.backend.school.model.TeacherEntity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepository extends JpaRepository<TeacherEntity, Integer>{
    
}
