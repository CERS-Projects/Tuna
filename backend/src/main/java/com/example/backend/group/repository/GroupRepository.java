package com.example.backend.group.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.group.model.GroupEntity;

public interface GroupRepository extends JpaRepository<GroupEntity, Integer> {
} 
