package com.example.backend.profile.dto;

import org.springframework.web.multipart.MultipartFile;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileUpdateRequest {
    
    private MultipartFile iconFile;  

    private String nickname;

    private String introduction;
    
    private String showUserId;
}
