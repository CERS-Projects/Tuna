package com.example.backend.accounts.model;

import com.example.backend.school.model.SchoolEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/* 
 * アカウント登録の基本情報を扱うエンティティ 
 * 生徒アカウント、教師アカウント共用で使う予定
 */

@Getter
@Setter
@Entity
@Table(name = "user_tb")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @ManyToOne
    @JoinColumn(name = "school_id",
                referencedColumnName = "school_id",
                nullable = false)
    private SchoolEntity school;

    @Column(name = "show_user_id",
            nullable = false,
            unique = true,
            length = 20
            )
    private String showUserId;

    @Column(name = "password",
            nullable = false,
            columnDefinition = "CHAR(60)"
            )
    private String password;

    @Column(name = "mailaddress",
            nullable = false,
            unique = true,
            length = 254
            )
    private String mailAddress;

    @Column(name = "name",
            nullable = false,
            length = 50
            )
    private String name;

    @Column(name = "accounts_stop_flag",
            columnDefinition = "BOOLEAN DEFAULT FALSE",
            nullable = false)
    private Boolean accountsStopFlag = false;
}
