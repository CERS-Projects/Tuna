package com.example.backend.classroom.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.backend.classroom.model.CategoryEntity;

import java.util.List;

import org.bson.types.ObjectId;

@Repository
public interface CategoryRepository extends MongoRepository<CategoryEntity, ObjectId> {  

    List<CategoryEntity> findByClassroomId(ObjectId classroomId);
    
}