package com.example.backend.report.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.report.model.ReportEntity;

@Repository
public interface ReportRepository extends MongoRepository<ReportEntity, ObjectId>{
    List<ReportEntity> findAllBySchoolId(Integer schoolId);
} 
