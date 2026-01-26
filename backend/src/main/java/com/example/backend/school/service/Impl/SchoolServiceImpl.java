package com.example.backend.school.service.Impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import com.example.backend.school.service.SchoolService;
import com.example.backend.exception.Model.SchoolNotFoundException;
import com.example.backend.school.dto.GetSchoolInformationRequest;
import com.example.backend.school.dto.GetSchoolInformationResponse;
import com.example.backend.school.dto.ModifySchoolInformationRequest;
import com.example.backend.school.dto.ModifySchoolInformationResponse;
import com.example.backend.school.dto.SchoolCreateRequest;
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
    public Integer createSchool(SchoolCreateRequest dto){
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

    @Override
    @Transactional(readOnly = true)
    public GetSchoolInformationResponse getSchoolInformation(GetSchoolInformationRequest dto){
        SchoolEntity schoolEntity = schoolRepository.findById(dto.getSchoolId())
            .orElseThrow(() -> new SchoolNotFoundException("学校が見つかりません"));

        GetSchoolInformationResponse response = new GetSchoolInformationResponse();
        response.setSchoolName(schoolEntity.getSchoolName());
        response.setSchoolAddress(schoolEntity.getSchoolAddress());
        response.setSchoolMailAddress(schoolEntity.getSchoolMailAddress());

        return response;
    }

    @Override
    @Transactional
    public ModifySchoolInformationResponse modifySchoolInformation(ModifySchoolInformationRequest dto){
        SchoolEntity schoolEntity = schoolRepository.findById(dto.getSchoolId())
            .orElseThrow(() -> new SchoolNotFoundException("学校が見つかりません"));

        schoolEntity.setSchoolName(dto.getSchoolName());
        schoolEntity.setSchoolAddress(dto.getSchoolAddress());
        schoolEntity.setSchoolMailAddress(dto.getSchoolMailAddress());

        SchoolEntity updatedSchool = schoolRepository.save(schoolEntity);

        ModifySchoolInformationResponse response = new ModifySchoolInformationResponse();
        response.setSchoolId(updatedSchool.getSchoolId());
        response.setSchoolName(updatedSchool.getSchoolName());
        response.setSchoolAddress(updatedSchool.getSchoolAddress());
        response.setSchoolMailAddress(updatedSchool.getSchoolMailAddress());

        return response;
    }

    
}
