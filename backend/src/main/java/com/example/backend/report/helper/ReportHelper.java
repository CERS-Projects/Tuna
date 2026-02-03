package com.example.backend.report.helper;

import java.util.Date;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import com.example.backend.accounts.repository.UserRepository;
import com.example.backend.posts.repository.PostRepository;
import com.example.backend.posts.model.PostEntity;
import com.example.backend.report.dto.ReportInsertRequest;
import com.example.backend.report.dto.ReportListResponse;
import com.example.backend.report.model.ReportEntity;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class ReportHelper {

    private final UserRepository userRepository;

    private final PostRepository postRepository;

    public record ReportedUserNameAndShowUserId(String name, String showUserId){} 

    public ReportEntity setEntityFromDto(ReportInsertRequest dto, Integer schoolId, Integer userId) {
        ReportEntity reportEntity = new ReportEntity();
        OffsetDateTime dateTimeNow = OffsetDateTime.now(ZoneOffset.UTC);
        
        /* 通報を作成しようとしたユーザが
        　・そのアカウントの存在する学校で
        　・通報対象とその通報者が存在するのか
        　上記2つの条件を満たしているどうかを検証 */
        long count = userRepository.validateByReportBySchoolId(schoolId, userId, dto.getReportedUser());
        if(count < 2){
            throw new IllegalArgumentException("そのユーザは存在しないか、報告ができません。");
        }
        
        reportEntity.setSchoolId(schoolId);
        reportEntity.setReportDate(Date.from(dateTimeNow.toInstant()));
        reportEntity.setReportBy(userId);
        reportEntity.setReportedUser(dto.getReportedUser());
        reportEntity.setReasonId(dto.getReasonId());
        if(ObjectId.isValid(dto.getReportedPostId()) == false) {
            throw new IllegalArgumentException("不正な投稿IDです。");
        }
        ObjectId reportedPostObjectId= new ObjectId(dto.getReportedPostId());
        reportEntity.setReportedPostId(reportedPostObjectId);
        reportEntity.setDetail(dto.getDetail());
        return reportEntity;
    }

    public List<ReportListResponse> convertEntitiesToResponses(List<ReportEntity> reportEntities) {

        if(reportEntities.isEmpty()) {
            throw new IllegalArgumentException("報告が存在しません。");
        }

        return reportEntities.stream().map(entity -> {
            ReportListResponse response = new ReportListResponse();
            ReportedUserNameAndShowUserId object = userRepository.findUserInfo(entity.getReportedUser())
                .orElseThrow(() -> new IllegalArgumentException("そのユーザは存在しないか、報告が存在しません。"));

            if(existsByUserId(entity.getReportedUser()) == false) {
                throw new IllegalArgumentException("そのユーザは存在しないか、報告が存在しません。");
            }
            PostEntity post = postRepository.findById(entity.getReportedPostId()).orElseThrow(() -> new IllegalArgumentException("その投稿は存在しないか、報告が存在しません。"));
            response.setReportedName(object.name());
            response.setReportId(entity.getReportId().toHexString()); // JSON形式で返すときにそのオブジェクトが作られた時間とマシンコードで返ってしまうため、文字列に変換
            response.setReportedShowUserId(object.showUserId());
            response.setReasonId(entity.getReasonId());
            response.setReportDate(entity.getReportDate());
            response.setReportedPost(post.getSentence());
            response.setReportDetail(entity.getDetail());
            return response;
        }).toList();
    }

    public boolean existsByUserId(Integer userId) {
        return userRepository.existsById(userId);
    }
}
