package com.example.backend.accounts.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.accounts.model.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Integer>{
    
}
