package com.example.backend.group.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.group.model.GroupEntity;

public interface GroupRepository extends JpaRepository<GroupEntity, Integer> {

    /*@Query(value = """
            WITH RECURSIVE 
            search_parent AS (
                --- 最上位のグループを取得 ---
                SELECT group_id, group_name, upper_group
                FROM group_tb
                WHERE school_id = :schoolId

                UNION ALL

                --- 最上位グループに紐づく下位グループを再帰的に取得 ---
                SELECT child.group_id, child.group_name, child.upper_group
                FROM group_tb AS child
                JOIN group_tb AS parent ON child.upper_group = parent.group_id)
            """, nativeQuery = true)*/

    
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
    void modifyGroupParentId(
        @Param("newParentId") Integer newParentId, 
        @Param("targetGroups") List<GroupEntity> targetGroups
    );
} 
