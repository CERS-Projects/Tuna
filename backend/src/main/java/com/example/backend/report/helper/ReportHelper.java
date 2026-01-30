package com.example.backend.report.helper;

import java.util.Date;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import com.example.backend.accounts.repository.UserRepository;
import com.example.backend.report.dto.ReportInsertRequest;
import com.example.backend.report.dto.ReportListResponse;
import com.example.backend.report.model.ReportEntity;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class ReportHelper {

    private final UserRepository userRepository;

    private final PostRepository postRepository;

    public ReportEntity setEntityFromDto(ReportInsertRequest dto){
        ReportEntity reportEntity = new ReportEntity();
        OffsetDateTime dateTimeNow = OffsetDateTime.now(ZoneOffset.UTC);
        reportEntity.setSchoolId(dto.getSchoolId());
        reportEntity.setReportDate(Date.from(dateTimeNow.toInstant()));
        reportEntity.setReportBy(dto.getReportBy());
        reportEntity.setReportedUser(dto.getReportedUser());
        reportEntity.setReasonId(dto.getReasonId());
        if(ObjectId.isValid(dto.getReportedPostId()) == false) {
            throw new IllegalArgumentException("不正な投稿IDです。");
        }
        ObjectId castedString = new ObjectId(dto.getReportedPostId());
        reportEntity.setReportedPostId(castedString);
        reportEntity.setDetail(dto.getDetail());
        return reportEntity;
    }

    public List<ReportListResponse> convertEntitiesToResponses(List<ReportEntity> reportEntities) {
        return reportEntities.stream().map(entity -> {
            ReportListResponse response = new ReportListResponse();
            response.setReportId(entity.getReportId().toHexString()); // JSON形式で返すときにそのオブジェクトが作られた時間とマシンコードで帰ってしまうため、文字列に変換
            response.setReportedName(userRepository.findNameByUserId(entity.getReportedUser()));
            if(reportEntities == null || existsByUserId(entity.getReportedUser()) == false) {
                throw new IllegalArgumentException("そのユーザは存在しないか、報告が存在しません。");
            } 
            response.setReportedShowUserId(userRepository.findShowUserIdByUserId(entity.getReportedUser()));
            response.setReasonId(entity.getReasonId());
            response.setReportDate(entity.getReportDate());
            response.setReportedPost(postRepository.findContentByPostId(entity.getReportedPostId()));
            response.setReportDetail(entity.getDetail());
            return response;
        }).toList();
    }

    public Boolean existsByUserId(Integer userId) {
        return userRepository.existsById(userId);
    }
}
