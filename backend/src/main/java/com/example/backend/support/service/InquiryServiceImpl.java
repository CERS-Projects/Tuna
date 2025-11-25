package com.example.backend.support.service;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import com.example.backend.support.model.InquiryEntity;
import com.example.backend.support.repository.InquiryRepository;

import org.springframework.lang.NonNull;
import org .springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional

public class InquiryServiceImpl implements InquiryService {

    private final InquiryRepository inquiryRepository;



    @Override
    //問い合わせの追加
    public void insertInquiry( @NonNull InquiryEntity inquiry) {
        inquiryRepository.save(inquiry);
    }

    @Override
    // 問い合わせの取得(date昇順)
    public List<InquiryEntity> selectInquiry() {
        return inquiryRepository.findAllByOrderByDatetimeAsc();
    }

    @Override
    public InquiryEntity findByInquiryId(@NonNull String _id) {
        return inquiryRepository.findById(_id).orElseThrow(() -> new RuntimeException("Inquiry not found"));
    }

    @Override
    //問い合わせIDをもとに削除
    public void deleteInquiry(@NonNull String _id) {
        if(!inquiryRepository.existsById(_id)) {
            throw new RuntimeException("Inquiry not found");
        }

        inquiryRepository.deleteById(_id);
    }

    public void updateStatus(@NonNull String _id, Integer newStatus) {
        // 1. IDで既存のエンティティを取得
        InquiryEntity inquiry = inquiryRepository.findById(_id)
            .orElseThrow(() -> new RuntimeException("Inquiry not found"));

        // 2. フィールドを変更
        inquiry.setInquiry_status(newStatus);

        // 3. 再保存（IDがあるので更新になる）
        inquiryRepository.save(inquiry);
    }
}