package com.example.backend.exception.Advice;

import org.apache.coyote.BadRequestException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpServerErrorException.InternalServerError;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.example.backend.exception.Model.ErrorResponseEntity;

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

    // 404
    @ExceptionHandler({ NoResourceFoundException.class, EmptyResultDataAccessException.class })
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponseEntity notFound(Exception e) {
        System.out.println(e.getMessage());
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
    @ExceptionHandler({ InternalServerError.class })
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponseEntity serverError(Exception e) {
        ErrorResponseEntity response = new ErrorResponseEntity(HttpStatus.INSUFFICIENT_STORAGE.value(), e.getMessage());
        log.error(response.getErrorMessage());
        return response;
    }

}
