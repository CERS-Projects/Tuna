package com.example.backend.group.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.group.helper.InstanceValidator;
import com.example.backend.group.model.GroupMemberEntity;

/* IdClassアノテーションを使用した場合の実装方法 */
public interface GroupMemberRepository extends JpaRepository<GroupMemberEntity, InstanceValidator> {

    @Modifying
    @Transactional
    @Query("DELETE FROM GroupMemberEntity WHERE groupId = :groupId")
    void deleteByGroupId(Integer groupId);
}
