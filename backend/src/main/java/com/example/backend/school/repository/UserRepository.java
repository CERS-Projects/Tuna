package com.example.backend.school.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.school.model.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Integer>{
    
}
