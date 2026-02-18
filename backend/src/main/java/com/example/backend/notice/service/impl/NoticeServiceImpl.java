package com.example.backend.notice.service.impl;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.group.model.GroupEntity;
import com.example.backend.group.repository.GroupMemberRepository;
import com.example.backend.group.repository.GroupRepository;
import com.example.backend.notice.dto.GetGroupIdAndGroupNameRecord;
import com.example.backend.notice.dto.NoticeInsertRequest;
import com.example.backend.notice.dto.NoticeListResponse;
import com.example.backend.notice.dto.NoticeModifyRequest;
import com.example.backend.notice.helper.NoticeHelper;
import com.example.backend.notice.model.NoticeEntity;
import com.example.backend.notice.repository.NoticeRepository;
import com.example.backend.notice.service.NoticeService;
import com.example.backend.school.repository.SchoolRepository;
import com.example.backend.utils.accountConfirm.AccountConfirm;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class NoticeServiceImpl implements NoticeService {

    private final SchoolRepository schoolRepository;

    private final NoticeRepository noticeRepository;

    private final GroupRepository groupRepository;

    private final GroupMemberRepository groupMemberRepository;

    private final NoticeHelper noticeHelper;

    private final AccountConfirm accountConfirm;

    @Override
    @Transactional
    public void createNotice(NoticeInsertRequest dto, Integer schoolId) {
        if (!groupRepository.existsById(dto.getGroupId()) || !groupRepository.existsGroupBySchoolIdAndGroupId(schoolId, dto.getGroupId())) {
            throw new IllegalArgumentException("そのグループは存在しないか、指定した学校に所属していません。");
        }
        noticeRepository.save(noticeHelper.toEntity(dto));
    }

    @Override
    @Transactional(readOnly = true)
    public List<NoticeListResponse> getNoticeListFromStudent(Integer userId, Integer schoolId) {
        if (!groupMemberRepository.existsByUserIdAndGroupId(userId, schoolId)) {
            throw new IllegalArgumentException("そのユーザーは存在しません。");
        }

        List<Integer> targetGroupIds = groupMemberRepository.findJoinedGroupIdsByUserId(userId);
        if (targetGroupIds.isEmpty()) {
            return List.of();
        }

        List<NoticeEntity> notices = noticeRepository.findAllByGroupIdIn(targetGroupIds);
        List<GetGroupIdAndGroupNameRecord> records = groupRepository.findGroupNameByGroupIdIn(notices.stream().map(NoticeEntity::getGroupId).distinct().toList());
        Map<Integer, String> groupIdToNameMap = records.stream()
            .collect(Collectors.toMap(record -> record.groupId(), record -> record.groupName()));

        return notices.stream().map(notice -> noticeHelper.toNoticeListResponse(notice, groupIdToNameMap)).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NoticeListResponse> getNoticeListFromTeacher(Integer schoolId) {
        if (!schoolRepository.existsById(schoolId)) {
            throw new IllegalArgumentException("その学校は存在しません。");
        }

        List<GroupEntity> groups = groupRepository.findBySchool_SchoolId(schoolId);
        if (groups.isEmpty()) {
            throw new IllegalArgumentException("その学校には指定されたグループが存在しません。");
        }

        List<Integer> groupIds = groups.stream().map(GroupEntity::getGroupId).distinct().toList();
        List<NoticeEntity> notices = noticeRepository.findAllByGroupIdIn(groupIds);
        List<GetGroupIdAndGroupNameRecord> records = groupRepository.findGroupNameByGroupIdIn(notices.stream().map(NoticeEntity::getGroupId).distinct().toList());
        Map<Integer, String> groupIdToNameMap = records.stream()
            .collect(Collectors.toMap(record -> record.groupId(), record -> record.groupName()));

        return notices.stream().map(notice -> noticeHelper.toNoticeListResponse(notice, groupIdToNameMap)).toList();
    }

    @Override
    @Transactional
    public void modifyNotice(NoticeModifyRequest dto, Integer schoolId) {
        if(!ObjectId.isValid(dto.getNoticeId())){
            throw new IllegalArgumentException("不正なお知らせIDです。");
        }
        final ObjectId noticeObjectId = new ObjectId(dto.getNoticeId());

        if(!groupRepository.existsById(dto.getGroupId()) || !groupRepository.existsGroupBySchoolIdAndGroupId(schoolId, dto.getGroupId())) {
            throw new IllegalArgumentException("そのグループは存在しないか、指定した学校に所属していません。");
        }
        if(!noticeRepository.existsById(noticeObjectId)) {
            throw new IllegalArgumentException("そのお知らせは存在しません。");
        }

        noticeRepository.save(noticeHelper.toEntity(dto, noticeObjectId));
    }

    @Override
    @Transactional
    public void deleteNotice(String noticeId, Integer userId, Integer schoolId) {
        if(!accountConfirm.existsByUserIdBySchoolId(userId, schoolId)) {
            throw new IllegalArgumentException("指定した学校に所属していません。");
        }
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
