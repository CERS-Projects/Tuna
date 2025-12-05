package com.example.backend.accounts.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/*
 * 権限状態を管理するためのエンティティ
 */

@Getter
@Setter
@Entity
@Table(name = "teacher_tb")
public class TeacherEntity {

    /* user_tbのuser_idを参照するかつ、このテーブルで主キーとして扱う書き方 */
    @Id
    private Integer userId;
    @MapsId
    @OneToOne
    @JoinColumn(name = "user_id", 
                referencedColumnName = "userId",
                nullable = false)
    private UserEntity teacherAccountId;

    @Column(name = "authority_flag",
            nullable = false,
            columnDefinition = "TINYINT(1)")
    private Integer authorityFlag;
}
