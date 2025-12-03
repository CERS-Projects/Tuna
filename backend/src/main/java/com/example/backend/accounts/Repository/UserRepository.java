package com.example.backend.accounts.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.accounts.Model.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Integer>{
    
}
