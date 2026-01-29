package com.example.backend.report.service.impl;

import java.util.List;

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
        ReportEntity reportEntity = reportHelper.setEntityFromDto(dto);
        reportRepository.save(reportEntity);
    }

    @Override
    @Transactional
    public List<ReportListResponse> getReportList(ReportListRequest dto) {
        // レポート一覧取得の実装をここに追加
        List<ReportEntity> reportEntities = reportRepository.findAllBySchoolId(dto.getSchoolId());
        List<ReportListResponse> responses = reportHelper.convertEntitiesToResponses(reportEntities);
        return responses; // 仮の戻り値
    }

    @Override
    @Transactional
    public void deleteReport(ReportDeleteRequest dto){
        reportRepository.deleteById(dto.getReportId());
    }
}
