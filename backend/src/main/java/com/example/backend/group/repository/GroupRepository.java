package com.example.backend.group.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.group.model.GroupEntity;
import com.example.backend.notice.dto.GetGroupIdAndGroupNameRecord;

public interface GroupRepository extends JpaRepository<GroupEntity, Integer> {

        List<GroupEntity> findBySchool_SchoolId(Integer schoolId);

        @Modifying
        @Transactional
        @Query("DELETE FROM GroupEntity WHERE groupId = :groupId")
        void deleteAllById(Integer groupId);

        // 親グループIDで子グループを取得
        List<GroupEntity> findAllByGroup_GroupId(Integer parentId);

        @Modifying
        @Transactional
        @Query("""
                        UPDATE GroupEntity g
                        SET g.group.groupId = :newParentId
                        WHERE g IN :targetGroups
                        """)
        void modifyGroupParentIds(
                        @Param("newParentId") Integer newParentId,
                        @Param("targetGroups") List<GroupEntity> targetGroups);

        @Modifying
        @Transactional
        @Query("""
                        UPDATE GroupEntity g
                        SET g.group.groupId = :newParentId
                        WHERE g.groupId = :targetGroup
                        """)
        void modifyGroupParentId(
                        @Param("newParentId") Integer newParentId,
                        @Param("targetGroup") Integer targetGroup);

        @Query("""
                        SELECT EXISTS(
                            SELECT g FROM GroupEntity g
                            WHERE g.school.schoolId = :schoolId AND g.groupId = :groupId
                        )
                        """)
        boolean existsGroupBySchoolIdAndGroupId(@Param("schoolId") Integer schoolId, @Param("groupId") Integer groupId);

        @Query("""
                        SELECT COUNT(DISTINCT g.groupId)
                        FROM GroupEntity g
                        WHERE g.school.schoolId = :schoolId AND g.groupId IN :groupIds
                        """)
        long countGroupsBySchoolIdAndGroupIds(@Param("schoolId") Integer schoolId, @Param("groupIds") List<Integer> groupIds);

        @Query("""
                        SELECT g FROM GroupMemberEntity gm
                            INNER JOIN
                                GroupEntity g ON gm.groupId = g.groupId
                            WHERE g.school.schoolId = :schoolId AND gm.userId = :userId
                        """)
        List<GroupEntity> findBySchoolAndUserId(
                        @Param("userId") Integer userId,
                        @Param("schoolId") Integer schoolId);
        
        @Query("""
            SELECT new com.example.backend.notice.dto.GetGroupIdAndGroupNameRecord(g.groupId, g.groupName) 
            FROM GroupEntity g
            WHERE g.groupId IN :groupId
            """)
        List<GetGroupIdAndGroupNameRecord> findGroupNameByGroupIdIn(@Param("groupId") List<Integer> groupId);
}
