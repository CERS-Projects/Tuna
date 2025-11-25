package com.example.backend.support.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.example.backend.support.model.InquiryEntity;


@Repository
public interface InquiryRepository extends MongoRepository< InquiryEntity, String> {
    List<InquiryEntity> findAllByOrderByDatetimeAsc();

};

