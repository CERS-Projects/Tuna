
package com.example.backend.support.model;
import org.springframework.data.annotation.Id; 
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter; 
import jakarta.validation.constraints.NotNull;
import java.util.Date;



@Document(collection = "inquiry_collection")
@Getter
@Setter
public class InquiryEntity {

    @Id
    private String _id;

    @NotNull
    private  Date datetime;

    @NotNull
    private String subject;

    @NotNull
    private String content;
    
    @NotNull
    private String mailaddress;

    @NotNull
    private Integer inquiry_status;
    
};
