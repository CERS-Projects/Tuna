package com.example.backend.report.service.impl;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.report.dto.ReportDeleteRequest;
import com.example.backend.report.dto.ReportInsertRequest;
import com.example.backend.report.dto.ReportListRequest;
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
    public void createReport(ReportInsertRequest dto) {
        if(dto.getReportedUser().equals(dto.getReportBy())) {
            throw new IllegalArgumentException("自分自身を報告することはできません。");
        }
        ReportEntity reportEntity = reportHelper.setEntityFromDto(dto);
        reportRepository.save(reportEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReportListResponse> getReportList(ReportListRequest dto) {
        List<ReportEntity> reportEntities = reportRepository.findAllBySchoolId(dto.getSchoolId());
        return reportHelper.convertEntitiesToResponses(reportEntities);
    }

    @Override
    @Transactional
    public void deleteReport(ReportDeleteRequest dto){
        if(ObjectId.isValid(dto.getReportId()) == false) {
            throw new IllegalArgumentException("不正なリクエストです。");
        }
        ObjectId reportId = new ObjectId(dto.getReportId());

        if(reportRepository.existsById(reportId) == false){
            throw new IllegalArgumentException("その報告は存在しません。");
        }
        reportRepository.deleteById(reportId);
    }
}
