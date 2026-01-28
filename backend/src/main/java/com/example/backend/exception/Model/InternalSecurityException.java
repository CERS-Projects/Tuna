package com.example.backend.exception.Model;

import org.springframework.security.core.AuthenticationException;

public class InternalSecurityException extends AuthenticationException {
    public InternalSecurityException(String msg) {
        super(msg);
    }
}
