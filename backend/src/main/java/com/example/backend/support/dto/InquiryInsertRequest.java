package com.example.backend.support.dto;
import lombok.Setter;
import lombok.Getter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;

@Getter
@Setter
    public class InquiryInsertRequest { 

        @NotBlank()
        @Size(max = 100)
        private String subject;

        @NotBlank()
        @Size(max = 300)
        private String content;

        @NotBlank()
        @Email
        private String mailaddress;

        @NotBlank()
        private Integer inquiry_status;
    }