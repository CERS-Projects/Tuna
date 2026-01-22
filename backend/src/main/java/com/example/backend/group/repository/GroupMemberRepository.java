package com.example.backend.group.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.group.helper.GroupMemberIds;
import com.example.backend.group.model.GroupMemberEntity;

/* IdClassアノテーションを使用した場合の実装方法 */
public interface GroupMemberRepository extends JpaRepository<GroupMemberEntity, GroupMemberIds> {

    @Modifying
    @Transactional
    @Query("DELETE FROM GroupMemberEntity WHERE groupId = :groupId")
    void deleteByGroupId(@Param("groupId") Integer groupId);

    @Query("SELECT userId FROM GroupMemberEntity WHERE groupId = :groupId")
    Set<Integer> findUserIdsByGroupId(@Param("groupId") Integer groupId);
}
