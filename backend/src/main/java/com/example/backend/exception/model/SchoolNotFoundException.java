package com.example.backend.exception.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SchoolNotFoundException extends RuntimeException {

    public SchoolNotFoundException(String message) {
        super(message);
    }

}
