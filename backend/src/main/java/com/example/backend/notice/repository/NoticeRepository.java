package com.example.backend.notice.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.notice.model.NoticeEntity;

@Repository
public interface NoticeRepository extends MongoRepository<NoticeEntity, ObjectId> {
        List<NoticeEntity> findAllByGroupIdIn(List<Integer> groupIds);
}
