package com.example.backend.accounts.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.accounts.Model.TeacherEntity;

public interface TeacherRepository extends JpaRepository<TeacherEntity, Integer>{
    
}
