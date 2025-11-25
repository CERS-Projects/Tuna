package com.example.backend.support.dto;
import jakarta.validation.constraints.NotNull;


import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InquiryUpdateRequest {

    @NotNull
    private String _id;

    @NotNull
    @NotBlank()
    private Integer inquiry_status;
}