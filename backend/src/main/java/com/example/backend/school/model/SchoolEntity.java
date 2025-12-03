package com.example.backend.school.model;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;

/*
 * 学校情報を扱うエンティティ
 */

@Getter
@Setter
@Entity
@Table( name = "school_info_tb" )
public class SchoolEntity {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer schoolId;

        @Column(name = "school_name",
                nullable = false,
                length = 256
                )
        private String schoolName;

        @Column(name = "school_code",
                nullable = false,
                unique = true,
                columnDefinition = "CHAR(13)"  
                )
         private String schoolCode;

        @Column(name = "school_address",
                nullable = false,
                length = 161
                )
        private String schoolAddress;

        @Column(name = "school_mailaddress",
                nullable = false,
                unique = true,
                length = 32
                )
        private String schoolMailAddress;

        @Column(name = "approval_status",
                nullable = false,
                columnDefinition = "TINYINT(1) DEFAULT 0"
                )
        @Enumerated( EnumType.ORDINAL )
        private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;
}
