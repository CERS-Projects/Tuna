package com.example.backend.exception.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SchoolNotFoundException extends RuntimeException {

    private Integer statusCode;
    private String errorMessage;

}
