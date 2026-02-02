package com.example.backend.notice.service.impl;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.group.model.GroupEntity;
import com.example.backend.group.repository.GroupMemberRepository;
import com.example.backend.group.repository.GroupRepository;
import com.example.backend.notice.dto.NoticeInsertRequest;
import com.example.backend.notice.dto.NoticeListResponse;
import com.example.backend.notice.dto.NoticeModifyRequest;
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
        return notices.stream().map(noticeHelper::toNoticeListResponse).toList();
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
        return notices.stream().map(noticeHelper::toNoticeListResponse).toList();
    }

    @Override
    @Transactional
    public void modifyNotice(NoticeModifyRequest dto) {
        if(!ObjectId.isValid(dto.getNoticeId())){
            throw new IllegalArgumentException("不正なお知らせIDです。");
        }
        final ObjectId noticeObjectId = new ObjectId(dto.getNoticeId());

        if(!noticeRepository.existsById(noticeObjectId)) {
            throw new IllegalArgumentException("そのお知らせは存在しません。");
        }
        if(!groupRepository.existsById(dto.getGroupId())) {
            throw new IllegalArgumentException("そのグループは存在しません。");
        }
        noticeRepository.save(noticeHelper.toEntity(dto, noticeObjectId));
    }

    @Override
    @Transactional
    public void deleteNotice(String noticeId) {
        if(!ObjectId.isValid(noticeId)){
            throw new IllegalArgumentException("不正なお知らせIDです。");
        }
        final ObjectId noticeObjectId = new ObjectId(noticeId);

        if(!noticeRepository.existsById(noticeObjectId)) {
            throw new IllegalArgumentException("そのお知らせは存在しません。");
        }
        noticeRepository.deleteById(noticeObjectId);
    }
}
