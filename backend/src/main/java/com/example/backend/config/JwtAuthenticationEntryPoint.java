package com.example.backend.config;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.example.backend.exception.Model.ErrorResponseEntity;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException) throws IOException {
        String authErrorMessage;
        ErrorResponseEntity errorResponseEntity;

        if (request.getAttribute("ERROR_MESSAGE") == null) {
            authErrorMessage = "ログインしなおしてください";
        } else {
            authErrorMessage = request.getAttribute("ERROR_MESSAGE").toString();
        }

        if (Boolean.TRUE.equals(request.getAttribute("IS_INTERNAL_ERROR"))) {
            errorResponseEntity = new ErrorResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR.value(), authErrorMessage);
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        } else {
            errorResponseEntity = new ErrorResponseEntity(HttpStatus.UNAUTHORIZED.value(),
                    authErrorMessage);
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
        }

        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(errorResponseEntity));

    }

}
