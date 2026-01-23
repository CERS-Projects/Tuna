package com.example.backend.group.model;

import com.example.backend.accounts.model.UserEntity;
import com.example.backend.group.helper.GroupMemberIds;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@IdClass(GroupMemberIds.class)
@Table(name = "group_member_tb")
public class GroupMemberEntity {
    @Id
    @Column(name = "group_id",
            nullable = false)
    private Integer groupId;

    @Id
    @Column(name = "user_id",
            nullable = false)
    private Integer userId;

    
    @ManyToOne
    @JoinColumn(name = "group_id",
                insertable = false,
                updatable = false,
                nullable = false)
    private GroupEntity group;

    @ManyToOne
    @JoinColumn(name = "user_id",
                insertable = false,
                updatable = false,
                nullable = false)
    private UserEntity user;
}
