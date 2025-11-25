package com.example.backend.support.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.example.backend.support.model.InquiryEntity;


@Repository
public interface InquiryRepository extends MongoRepository< InquiryEntity, String> {
    //日時昇順で全件取得
    List<InquiryEntity> findAllByOrderByDatetimeAsc();

};

