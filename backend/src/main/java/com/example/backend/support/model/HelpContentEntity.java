package com.example.backend.support.model;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.Range;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "help_contents_tb")
public class HelpContentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Range(min = 1, max = 999)
    @Column(name = "help_contents_id")
    private Integer contentId;

    @NotNull
    @Range(min = 1, max = 99)
    @Column(name = "help_category_id")
    private Integer categoryId;

    @NotBlank
    @Length(min = 1, max = 255)
    private String question;

    @NotBlank
    private String answer;
}