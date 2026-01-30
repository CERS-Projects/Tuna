package com.example.backend.dto;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileUpdateRequest {

  
  MultipartFile icon;

  String introduction;

  String showUserId;


}
