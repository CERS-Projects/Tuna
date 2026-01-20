package com.example.backend.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.auth.model.RefreshTokenEntity;

@Repository
public interface RefreshTokenRepository extends
        JpaRepository<RefreshTokenEntity, Integer> {
    RefreshTokenEntity findByUserId(Integer userId);
}
