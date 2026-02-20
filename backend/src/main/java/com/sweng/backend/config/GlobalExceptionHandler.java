package com.sweng.backend.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

/** Global exception handler for converting exceptions to appropriate HTTP responses. */
@ControllerAdvice
public class GlobalExceptionHandler {

  /** Default constructor. */
  public GlobalExceptionHandler() {}

  /**
   * Handles type mismatch exceptions (e.g., passing "0.0" to an int parameter).
   *
   * @param ex the exception
   * @return 400 Bad Request response
   */
  @ExceptionHandler(MethodArgumentTypeMismatchException.class)
  public ResponseEntity<String> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
    String message =
        String.format(
            "Invalid value '%s' for parameter '%s': expected type %s",
            ex.getValue(), ex.getName(), ex.getRequiredType().getSimpleName());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
  }

  /**
   * Handles missing or malformed request body.
   *
   * @param ex the exception
   * @return 400 Bad Request response
   */
  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<String> handleMissingBody(HttpMessageNotReadableException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or missing request body");
  }

  /**
   * Handles validation errors on request body fields.
   *
   * @param ex the exception
   * @return 400 Bad Request response
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<String> handleValidationError(MethodArgumentNotValidException ex) {
    String message =
        ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .reduce((a, b) -> a + "; " + b)
            .orElse("Validation failed");
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
  }
}
