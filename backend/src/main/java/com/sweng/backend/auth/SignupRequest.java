package com.sweng.backend.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Request object for user signup. */
public class SignupRequest {

  /** Constructs a SignupRequest with default values. */
  public SignupRequest() {}

  @NotBlank
  @Size(min = 3, max = 50)
  private String username;

  @NotBlank
  @Email
  @Size(max = 120)
  private String email;

  @NotBlank
  @Size(min = 6, max = 100)
  private String password;

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
   * Gets the email.
   *
   * @return the email
   */
  public String getEmail() {
    return email;
  }

  /**
   * Sets the email.
   *
   * @param email the email to set
   */
  public void setEmail(String email) {
    this.email = email;
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
