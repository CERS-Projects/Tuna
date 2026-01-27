package com.example.backend.report.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.report.model.ReasonEntity;

public interface ReasonRepository extends MongoRepository<ReasonEntity, ObjectId>{

}
