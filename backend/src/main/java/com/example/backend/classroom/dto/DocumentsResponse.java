package com.example.backend.classroom.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Getter
@Setter
public class DocumentsResponse {

    private String documentId;

    private String documentName;

    private String documentUrl;

    private Date uploadedAt; 

}
