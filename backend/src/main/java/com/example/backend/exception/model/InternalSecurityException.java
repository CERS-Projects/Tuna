package com.example.backend.exception.model;

import org.springframework.security.core.AuthenticationException;

public class InternalSecurityException extends AuthenticationException {
    public InternalSecurityException(String msg) {
        super(msg);
    }
}
