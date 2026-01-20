package com.example.backend.exception.Advice;

import java.io.IOException;

import org.apache.coyote.BadRequestException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpServerErrorException.InternalServerError;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.example.backend.exception.AuthException;
import com.example.backend.exception.Model.ErrorResponseEntity;
import com.example.backend.exception.Model.SchoolNotFoundException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class ExceptionCatch {

    // 400
    @ExceptionHandler({ BadRequestException.class, IllegalArgumentException.class })
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponseEntity badRequest(Exception e) {
        ErrorResponseEntity response = new ErrorResponseEntity(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        log.error(response.getErrorMessage());
        return response;
    }

    @ExceptionHandler({ MethodArgumentTypeMismatchException.class })
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponseEntity notParam() {
        ErrorResponseEntity response = new ErrorResponseEntity(HttpStatus.BAD_REQUEST.value(), "無効なリクエストです");
        log.error(response.getErrorMessage());
        return response;
    }

    // 401
    @ExceptionHandler({ AuthException.class, UsernameNotFoundException.class, TokenExpiredException.class,
            JWTVerificationException.class })
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponseEntity expError(Exception e) {
        ErrorResponseEntity response = new ErrorResponseEntity(HttpStatus.UNAUTHORIZED.value(), e.getMessage());
        log.error(response.getErrorMessage());
        System.out.println(response);
        return response;
    }

    // 403
    @ExceptionHandler({ AccessDeniedException.class })
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponseEntity authorityError(Exception e) {
        ErrorResponseEntity response = new ErrorResponseEntity(HttpStatus.FORBIDDEN.value(), e.getMessage());
        log.error(response.getErrorMessage());
        return response;
    }

    // 404
    @ExceptionHandler({ NoResourceFoundException.class, EmptyResultDataAccessException.class, SchoolNotFoundException.class })
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponseEntity notFound(Exception e) {
        ErrorResponseEntity response = new ErrorResponseEntity(HttpStatus.NOT_FOUND.value(), e.getMessage());
        log.error(response.getErrorMessage());
        return response;
    }

    // 409
    @ExceptionHandler({ DataIntegrityViolationException.class })
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponseEntity unique(Exception e) {
        ErrorResponseEntity response = new ErrorResponseEntity(HttpStatus.CONFLICT.value(), e.getMessage());
        log.error(response.getErrorMessage());
        return response;
    }

    // 500
    @ExceptionHandler({ InternalServerError.class, IOException.class })
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponseEntity serverError(Exception e) {
        ErrorResponseEntity response = new ErrorResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                e.getMessage());
        log.error(response.getErrorMessage());
        return response;
    }
}
