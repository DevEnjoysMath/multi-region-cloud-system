package com.sweng.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/** Spring Boot application entry point. */
@SpringBootApplication
public class BackendApplication {

  /** Prevents instantiation of the application class. */
  private BackendApplication() {}

  /**
   * Launches the Spring Boot application.
   *
   * @param args command-line arguments passed to the application
   */
  public static void main(String[] args) {
    SpringApplication.run(BackendApplication.class, args);
  }
}
