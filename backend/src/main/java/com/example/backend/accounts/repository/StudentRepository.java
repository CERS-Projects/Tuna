package com.example.backend.accounts.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.accounts.model.StudentEntity;

public interface StudentRepository extends JpaRepository<StudentEntity, Integer> {

}
