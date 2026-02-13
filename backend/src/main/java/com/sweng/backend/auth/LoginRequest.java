package com.sweng.backend.auth;

import jakarta.validation.constraints.NotBlank;

/** Request object for user login. */
public class LoginRequest {

  /** Constructs a LoginRequest with default values. */
  public LoginRequest() {}

  @NotBlank private String username;

  @NotBlank private String password;

  /**
   * Gets the username.
   *
   * @return the username
   */
  public String getUsername() {
    return username;
  }

  /**
   * Sets the username.
   *
   * @param username the username to set
   */
  public void setUsername(String username) {
    this.username = username;
  }

  /**
   * Gets the password.
   *
   * @return the password
   */
  public String getPassword() {
    return password;
  }

  /**
   * Sets the password.
   *
   * @param password the password to set
   */
  public void setPassword(String password) {
    this.password = password;
  }
}
