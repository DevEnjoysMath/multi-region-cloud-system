package com.sweng.backend.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Request object for user registration. */
public class RegisterRequest {

  @NotBlank
  @Size(min = 3, max = 50)
  private String username;

  @NotBlank
  @Email
  @Size(max = 120)
  private String email;

  @NotBlank
  @Size(min = 8, max = 100)
  private String password;

  @Size(max = 50)
  private String firstName;

  @Size(max = 50)
  private String lastName;

  /** Constructs a RegisterRequest with default values. */
  public RegisterRequest() {}

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
   * Gets the email address.
   *
   * @return the email address
   */
  public String getEmail() {
    return email;
  }

  /**
   * Sets the email address.
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

  /**
   * Gets the first name.
   *
   * @return the first name
   */
  public String getFirstName() {
    return firstName;
  }

  /**
   * Sets the first name.
   *
   * @param firstName the first name to set
   */
  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  /**
   * Gets the last name.
   *
   * @return the last name
   */
  public String getLastName() {
    return lastName;
  }

  /**
   * Sets the last name.
   *
   * @param lastName the last name to set
   */
  public void setLastName(String lastName) {
    this.lastName = lastName;
  }
}
