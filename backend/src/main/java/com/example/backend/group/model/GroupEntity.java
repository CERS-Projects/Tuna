package com.example.backend.group.model;

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

@Getter
@Setter
@Entity
@Table(name = "group_tb")
public class GroupEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "group_id")
    private Integer groupId;

    @Column(name = "group_name",
            nullable = false,
            length = 50)
    private String groupName;

    /* 
     * JoinColumnの動作
     * DBに値を追加するとき：SchoolEntityのschoolIdを、group_tbのschool_idに格納
     * DBから値を取得するとき：group_tbのschool_idから値を抽出して、school_info_tbか値を取得したように扱って
     */
    @ManyToOne
    @JoinColumn(name = "school_id",
                nullable = false)
    private SchoolEntity school;

    @ManyToOne
    @JoinColumn(name = "upper_group")
    private GroupEntity group;
}
