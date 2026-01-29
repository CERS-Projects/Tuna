package com.example.backend.report.model;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import org.springframework.data.annotation.Id;
import jakarta.validation.constraints.NotNull;

import java.util.Date;

import org.bson.types.ObjectId;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "report_collection")
public class ReportEntity {
    @Id
    @NotNull
    private ObjectId reportId;

    @Field("school_id")
    @NotNull
    private Integer schoolId;

    @Field("report_date")
    @NotNull
    private Date reportDate;

    @Field("report_by")
    @NotNull
    private Integer reportBy;

    @Field("reported_user")
    @NotNull
    private Integer reportedUser;

    @Field("reason_id")
    @NotNull
    private Integer reasonId;

    @Field("detail")
    @NotNull
    private String detail;
}
