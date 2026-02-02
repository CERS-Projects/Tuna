package com.example.backend.notice.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.group.model.GroupEntity;
import com.example.backend.group.repository.GroupMemberRepository;
import com.example.backend.group.repository.GroupRepository;
import com.example.backend.notice.dto.NoticeInsertRequest;
import com.example.backend.notice.dto.NoticeListResponse;
import com.example.backend.notice.helper.NoticeHelper;
import com.example.backend.notice.model.NoticeEntity;
import com.example.backend.notice.repository.NoticeRepository;
import com.example.backend.notice.service.NoticeService;
import com.example.backend.school.repository.SchoolRepository;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class NoticeServiceImpl implements NoticeService {

    private final SchoolRepository schoolRepository;

    private final NoticeRepository noticeRepository;

    private final GroupRepository groupRepository;

    private final GroupMemberRepository groupMemberRepository;

    private final NoticeHelper noticeHelper;

    @Override
    @Transactional
    public void createNotice(NoticeInsertRequest dto) {
        if (!groupRepository.existsById(dto.getGroupId())) {
            throw new IllegalArgumentException("そのグループは存在しません。");
        }
        noticeRepository.save(noticeHelper.toEntity(dto));
    }

    @Override
    @Transactional(readOnly = true)
    public List<NoticeListResponse> getNoticeListFromStudent(Integer userId, Integer schoolId) {
        if (!groupMemberRepository.existsByUserId(userId, schoolId)) {
            throw new IllegalArgumentException("そのユーザーは存在しません。");
        }

        List<Integer> joinedGroupIds = groupMemberRepository.findJoinedGroupIdsByUserId(userId);
        if (joinedGroupIds.isEmpty()) {
            return List.of();
        }

        List<NoticeEntity> notices = noticeRepository.findAllByGroupIdIn(joinedGroupIds);
        return notices.stream().map(this::toNoticeListResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NoticeListResponse> getNoticeListFromTeacher(Integer schoolId) {
        if (!schoolRepository.existsById(schoolId)) {
            throw new IllegalArgumentException("その学校は存在しません。");
        }

        List<GroupEntity> groups = groupRepository.findBySchool_SchoolId(schoolId);
        if (groups.isEmpty()) {
            throw new IllegalArgumentException("その学校にはグループが存在しません。");
        }

        List<Integer> groupIds = groups.stream().map(GroupEntity::getGroupId).toList();
        List<NoticeEntity> notices = noticeRepository.findAllByGroupIdIn(groupIds);
        return notices.stream().map(this::toNoticeListResponse).toList();
    }

    private NoticeListResponse toNoticeListResponse(NoticeEntity entity) {
        NoticeListResponse response = new NoticeListResponse();
        response.setNoticeId(entity.getNoticeId().toHexString());
        response.setGroupId(entity.getGroupId());
        response.setTitle(entity.getTitle());
        response.setContent(entity.getContent());
        response.setCreatedAt(entity.getCreatedAt());    

        return response;
    }
}
