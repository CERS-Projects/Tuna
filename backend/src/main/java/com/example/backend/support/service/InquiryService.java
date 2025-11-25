package com.example.backend.support.service;

import com.example.backend.support.model.InquiryEntity;
import org.springframework.lang.NonNull;

import java.util.List;

public interface InquiryService {

    void insertInquiry(@NonNull InquiryEntity inquiry);
    
    List<InquiryEntity> selectInquiry();

    InquiryEntity findByInquiryId(@NonNull String _id);

    void deleteInquiry(@NonNull String _id );

    void updateStatus(@NonNull String _id, Integer newStatus);
}
