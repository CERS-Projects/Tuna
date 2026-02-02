package com.example.backend.report.service.impl;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.report.dto.ReportInsertRequest;
import com.example.backend.report.dto.ReportListResponse;
import com.example.backend.report.helper.ReportHelper;
import com.example.backend.report.model.ReportEntity;
import com.example.backend.report.repository.ReportRepository;
import com.example.backend.report.service.ReportService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;

    private final ReportHelper reportHelper;

    @Override
    @Transactional
    public void createReport(ReportInsertRequest dto, Integer schoolId, Integer userId){ 
        if(dto.getReportedUser().equals(userId)) {
            throw new IllegalArgumentException("自分自身を報告することはできません。");
        }
        ReportEntity reportEntity = reportHelper.setEntityFromDto(dto, schoolId, userId);
        reportRepository.save(reportEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportListResponse> getReportList(Integer schoolId){ 
        List<ReportEntity> reportEntities = reportRepository.findAllBySchoolId(schoolId);
        return reportHelper.convertEntitiesToResponses(reportEntities);
    }

    @Override
    @Transactional
    public void deleteReport(String reportId){
        if(ObjectId.isValid(reportId) == false) {
            throw new IllegalArgumentException("不正なリクエストです。");
        }
        ObjectId reportIdObject = new ObjectId(reportId);
        if(reportRepository.existsById(reportIdObject) == false){
            throw new IllegalArgumentException("その報告は存在しません。");
        }
        reportRepository.deleteById(reportIdObject);
    }
}
