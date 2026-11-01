package com.ebookreader.ebook_backend.common.exception;

import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ErrorResponseDTO> handleResponseNotFoundException(
                        ResourceNotFoundException ex, HttpServletRequest request) {
                return createErrorResponse(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), request, null);
        }

        @ExceptionHandler(BusinessException.class)
        public ResponseEntity<ErrorResponseDTO> handleBusinessException(
                        BusinessException ex, HttpServletRequest request) {
                return createErrorResponse(HttpStatus.BAD_REQUEST, "Business Logic Error", ex.getMessage(), request,
                                null);
        }

        @ExceptionHandler(UnauthorizedException.class)
        public ResponseEntity<ErrorResponseDTO> handleUnauthorizedException(
                        UnauthorizedException ex, HttpServletRequest request) {
                return createErrorResponse(HttpStatus.UNAUTHORIZED, "Unauthorized", ex.getMessage(), request, null);
        }

        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<ErrorResponseDTO> handleAccessDeniedException(
                        AccessDeniedException ex, HttpServletRequest request) {
                return createErrorResponse(HttpStatus.FORBIDDEN, "Forbidden",
                                "Bu işlem için yetkiniz bulunmamaktadır.", request, null);
        }

        @ExceptionHandler(AuthenticationException.class)
        public ResponseEntity<ErrorResponseDTO> handleAuthenticationException(
                        AuthenticationException ex, HttpServletRequest request) {
                // One message for every failure (bad password, unknown or disabled user) so it reveals nothing.
                return createErrorResponse(HttpStatus.UNAUTHORIZED, "Unauthorized",
                                "Kullanıcı adı veya şifre hatalı.", request, null);
        }

        @ExceptionHandler({ MethodArgumentTypeMismatchException.class, HttpMessageNotReadableException.class })
        public ResponseEntity<ErrorResponseDTO> handleBadRequest(
                        Exception ex, HttpServletRequest request) {
                return createErrorResponse(HttpStatus.BAD_REQUEST, "Bad Request",
                                "İstek geçersiz veya hatalı biçimlendirilmiş.", request, null);
        }

        @ExceptionHandler(NoResourceFoundException.class)
        public ResponseEntity<ErrorResponseDTO> handleNoResource(
                        NoResourceFoundException ex, HttpServletRequest request) {
                return createErrorResponse(HttpStatus.NOT_FOUND, "Not Found", "Kaynak bulunamadı.", request, null);
        }

        @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
        public ResponseEntity<ErrorResponseDTO> handleMethodNotSupported(
                        HttpRequestMethodNotSupportedException ex, HttpServletRequest request) {
                return createErrorResponse(HttpStatus.METHOD_NOT_ALLOWED, "Method Not Allowed",
                                "Bu uç için HTTP yöntemi desteklenmiyor.", request, null);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponseDTO> handleGeneralException(
                        Exception ex, HttpServletRequest request) {

                log.error("Beklenmeyen hata: {} {}", request.getMethod(), request.getRequestURI(), ex);

                // Never echo the exception class or message back to the client.
                return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                                "Internal Server Error",
                                "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
                                request,
                                null);
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorResponseDTO> handleValidationException(
                        MethodArgumentNotValidException ex, HttpServletRequest request) {
                Map<String, String> validationErrors = new HashMap<>();
                ex.getBindingResult().getFieldErrors()
                                .forEach(error -> validationErrors.put(error.getField(), error.getDefaultMessage()));

                return createErrorResponse(HttpStatus.BAD_REQUEST,
                                "Validation Error",
                                "Lütfen form alanlarını kontrol edin.",
                                request,
                                validationErrors);
        }

        private ResponseEntity<ErrorResponseDTO> createErrorResponse(
                        HttpStatus status, String error, String message, HttpServletRequest request,
                        Map<String, String> validationErrors) {
                ErrorResponseDTO errorResponseDTO = ErrorResponseDTO.builder()
                                .timestamp(LocalDateTime.now())
                                .status(status.value())
                                .error(error)
                                .message(message)
                                .path(request.getRequestURI())
                                .validationErrors(validationErrors)
                                .build();
                return new ResponseEntity<>(errorResponseDTO, status);
        }

        @ExceptionHandler(ExpiredJwtException.class)
        public ResponseEntity<ErrorResponseDTO> handleExpiredJwtException(
                        ExpiredJwtException ex, HttpServletRequest request) {

                ErrorResponseDTO errorResponse = ErrorResponseDTO.builder()
                                .timestamp(LocalDateTime.now())
                                .status(HttpStatus.UNAUTHORIZED.value())
                                .error("Unauthorized")
                                .message("Oturum süreniz doldu, lütfen tekrar giriş yapın.")
                                .path(request.getRequestURI())
                                .build();

                return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }

}
