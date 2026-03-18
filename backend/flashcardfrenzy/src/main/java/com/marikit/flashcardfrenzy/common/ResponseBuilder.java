package com.marikit.flashcardfrenzy.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.Instant;

public final class ResponseBuilder {

    private ResponseBuilder() {
        // Utility class — no instantiation
    }

    public static <T> ResponseEntity<ApiResponse<T>> success(T data) {
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    public static <T> ResponseEntity<ApiResponse<T>> created(T data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(data));
    }

    public static ResponseEntity<ApiResponse<Object>> error(
            HttpStatus status, String code, String message, Object details) {
        ApiResponse<Object> body = ApiResponse.<Object>builder()
                .success(false)
                .data(null)
                .error(ApiResponse.ErrorDetail.builder()
                        .code(code)
                        .message(message)
                        .details(details)
                        .build())
                .timestamp(Instant.now().toString())
                .build();
        return ResponseEntity.status(status).body(body);
    }
}
