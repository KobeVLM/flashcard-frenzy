package com.marikit.flashcardfrenzy.common;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.persistence.EntityNotFoundException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> fieldErrors.put(error.getField(), error.getDefaultMessage()));

        return ResponseBuilder.error(HttpStatus.BAD_REQUEST, "VALID-001", "Validation failed", fieldErrors);
    }

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<Object>> handleAppException(AppException ex) {
        return ResponseBuilder.error(ex.getHttpStatus(), ex.getErrorCode(), ex.getMessage(), ex.getDetails());
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleUsernameNotFoundException(UsernameNotFoundException ex) {
        return ResponseBuilder.error(HttpStatus.UNAUTHORIZED, "AUTH-001", "Invalid credentials", null);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDeniedException(AccessDeniedException ex) {
        return ResponseBuilder.error(HttpStatus.FORBIDDEN, "AUTH-003", "Insufficient permissions", null);
    }

    @ExceptionHandler({ AuthenticationException.class, BadCredentialsException.class })
    public ResponseEntity<ApiResponse<Object>> handleAuthenticationException(Exception ex) {
        return ResponseBuilder.error(HttpStatus.UNAUTHORIZED, "AUTH-001", "Invalid credentials", null);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleEntityNotFoundException(EntityNotFoundException ex) {
        return ResponseBuilder.error(HttpStatus.NOT_FOUND, "DB-001", "Resource not found", ex.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        return ResponseBuilder.error(HttpStatus.CONFLICT, "DB-002", "Duplicate entry or constraint violation", null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericException(Exception ex) {
        return ResponseBuilder.error(HttpStatus.INTERNAL_SERVER_ERROR, "SYSTEM-001", "Internal server error", null);
    }
}
