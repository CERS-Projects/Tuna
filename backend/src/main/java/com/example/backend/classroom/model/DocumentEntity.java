package com.example.backend.classroom.model;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;
import org.bson.types.ObjectId;

@Getter
@Setter
@Document(collection = "classroom_document_collection")
public class DocumentEntity {
    
    @Id
    private ObjectId id;

    @Field("classroom_category_id")
    private ObjectId classroomCategoryId;

    @Field("document_name")
    private String documentName;

    @Field("document_objectKey")
    private String documentObjectKey;

    @Field("upload_date")
    private Date uploadDate;
}
