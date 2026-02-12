package com.example.backend.classroom.dto;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class DocumentItem {

    private MultipartFile documentFile;

}
