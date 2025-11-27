package com.example.backend.school.service.Impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.example.backend.school.service.SchoolService;
import com.example.backend.school.dto.CreateSchoolDto;
import com.example.backend.school.model.ApprovalStatus;
import com.example.backend.school.model.SchoolEntity;
import com.example.backend.school.repository.SchoolRepository;

/*
 * 学校情報を追加する機能を提供する
 */
@Service
@RequiredArgsConstructor
public class SchoolServiceImpl implements SchoolService{
    
    private final SchoolRepository schoolRepository;

    /* 学校用のデータを追加する機能 */
    @Override
    @Transactional
    public Integer createSchool(CreateSchoolDto dto){
        SchoolEntity newSchool = new SchoolEntity();
        
        /* dtoの内容をモデルにセットする */
        newSchool.setSchoolName(dto.getSchoolName());
        newSchool.setSchoolCode(dto.getSchoolCode());
        newSchool.setSchoolAddress(dto.getSchoolAddress());
        newSchool.setSchoolMailAddress(dto.getSchoolMailAddress());
        newSchool.setApprovalStatus(ApprovalStatus.PENDING);

        /* セットした内容をDBに追加 */
        SchoolEntity savedSchool = schoolRepository.save(newSchool);
        return savedSchool.getSchoolId();
    }

    
}
