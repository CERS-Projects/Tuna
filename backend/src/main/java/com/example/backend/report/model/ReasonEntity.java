package com.example.backend.report.model;

import org.springframework.data.mongodb.core.mapping.Field;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection = "reason_collection")
public class ReasonEntity {
    @Id
    private ObjectId reasonId;

    @Field("reason")
    @NotNull
    private String reason;
}
