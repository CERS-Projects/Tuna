package com.example.backend.accounts.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "student_tb")
public class StudentEntity {
    @Id
    private Integer userId;

    @MapsId
    @OneToOne
    @JoinColumn(name = "user_id",
                referencedColumnName = "userId",
                nullable = false)
    private UserEntity studentAccount;

    @Column(name = "grade",
            nullable = false,
            columnDefinition = "INT(1)")
    private Integer grade;

    @Column(name = "admission_date",
            nullable = false)
    private LocalDate admissionDate;

    @Column(name = "graduate_date")
    private LocalDate graduateDate;

}
