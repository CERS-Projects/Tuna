package com.example.backend.group.service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.accounts.helper.AccountsHelper;
import com.example.backend.group.dto.GroupCreateRequest;
import com.example.backend.group.helper.GroupHelper;
import com.example.backend.group.model.GroupEntity;
import com.example.backend.group.model.GroupMemberEntity;
import com.example.backend.group.repository.GroupMemberRepository;
import com.example.backend.group.repository.GroupRepository;
import com.example.backend.group.service.GroupService;
import com.example.backend.school.model.SchoolEntity;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class GroupServiceImpl implements GroupService{

    private final AccountsHelper accountsHelper;

    private final GroupRepository groupRepository;

    private final GroupMemberRepository groupMemberRepository;

    private final GroupHelper groupHelper;

    /* グループ作成 */
    @Transactional
    @Override
    public void createGroup(GroupCreateRequest dto){
        GroupEntity groupEntity = toGroupEntity(dto);
        groupRepository.save(groupEntity);
    }
    
    /* GroupCreateRequest DTOをGroupEntityに変換 */
    @Transactional
    private GroupEntity toGroupEntity(GroupCreateRequest dto){
        SchoolEntity schoolEntity = accountsHelper.findSchoolEntityById(dto.getSchoolId());
        /* debug_begin */
        System.out.println("============検索した学校IDの取得============");
        System.out.println("SchoolEntity: " + schoolEntity.getSchoolName());
        /* end_debug */
        GroupEntity groupEntity = new GroupEntity();
        GroupEntity parentGroupId = groupHelper.findGroupEntityById(dto.getParentGroupId());
         /* debug_begin */
        System.out.println("============検索した上位グループIDの取得============");
        System.out.println("ParentGroupId: " + parentGroupId);
        /* end_debug */
        groupEntity.setGroupName(dto.getGroupName());
        groupEntity.setSchool(schoolEntity);
        groupEntity.setGroup(parentGroupId);

        GroupEntity savedGroupEntity = groupRepository.save(groupEntity);

        /* グループメンバー追加 */
        List<GroupMemberEntity> memberEntities = dto.getMembersUserId()
                                                    .stream()
                                                    .map(userId->{
                                                        GroupMemberEntity member = new GroupMemberEntity();
                                                        member.setGroupId(savedGroupEntity.getGroupId());
                                                        member.setUserId(userId);
                                                        return member;
                                                    })
                                                    .collect(Collectors.toList());
        groupMemberRepository.saveAll(memberEntities);
        return groupEntity;
    }
}