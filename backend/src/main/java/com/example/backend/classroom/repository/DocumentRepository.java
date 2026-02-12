package com.example.backend.classroom.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.backend.classroom.model.DocumentEntity;

import java.util.List;

import org.bson.types.ObjectId;

@Repository
public interface DocumentRepository extends MongoRepository<DocumentEntity, ObjectId> {  

    List<DocumentEntity> findByClassroomCategoryId(ObjectId classroomCategoryId);
}