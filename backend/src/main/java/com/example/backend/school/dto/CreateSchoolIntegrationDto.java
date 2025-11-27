package com.example.backend.school.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/* 
 *   一つのリクエストボディに登録するためのDto
 */

@RequiredArgsConstructor
@Getter
public class CreateSchoolIntegrationDto {
    @NotNull
    @Valid 
    private final CreateSchoolDto schoolDto;
    
    @NotNull
    @Valid 
    private final CreateTeacherDto createTeacherDto;
}
