package com.example.backend.config;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import com.example.backend.exception.model.ErrorResponseEntity;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedHandler) throws IOException {
        ErrorResponseEntity errorResponseEntity;
        if (request.getAttribute("ERROR_MESSAGE") != null) {
            errorResponseEntity = new ErrorResponseEntity(HttpStatus.FORBIDDEN.value(),
                    request.getAttribute("ERROR_MESSAGE").toString());
        } else {
            errorResponseEntity = new ErrorResponseEntity(HttpStatus.FORBIDDEN.value(),
                    "権限不足です");
        }

        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(errorResponseEntity));

    }
}
