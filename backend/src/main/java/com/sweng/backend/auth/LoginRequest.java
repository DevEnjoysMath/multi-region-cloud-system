package com.sweng.backend.auth;

import jakarta.validation.constraints.NotBlank;

/** Request object for user login. */
public class LoginRequest {

  /** Constructs a LoginRequest with default values. */
  public LoginRequest() {}

  /** Username or email address of the user attempting to log in. */
  @NotBlank private String identifier;

  /** Password of the user attempting to log in. */
  @NotBlank private String password;

  /**
   * Gets the identifier.
   *
   * @return the username or email address
   */
  public String getIdentifier() {
    return identifier;
  }

  /**
   * Sets the identifier.
   *
   * @param identifier the username or email address to set
   */
  public void setIdentifier(String identifier) {
    this.identifier = identifier;
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
