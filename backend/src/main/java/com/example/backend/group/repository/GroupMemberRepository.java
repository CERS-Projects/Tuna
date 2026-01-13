package com.example.backend.group.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.group.helper.InstanceValidator;
import com.example.backend.group.model.GroupMemberEntity;

/* IdClassアノテーションを使用した場合の実装方法 */
public interface GroupMemberRepository extends JpaRepository<GroupMemberEntity, InstanceValidator> {

}
