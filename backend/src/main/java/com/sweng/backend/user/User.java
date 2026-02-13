package com.sweng.backend.user;

import jakarta.persistence.*;
import java.util.UUID;

/** Entity representing a user in the system. */
@Entity
@Table(name = "users")
public class User {

  @Id
  @Column(nullable = false, updatable = false)
  private UUID uid;

  @Column(nullable = false, unique = true, length = 50)
  private String username;

  @Column(nullable = false, unique = true, length = 120)
  private String email;

  // store BCrypt hash
  @Column(nullable = false)
  private String passwordHash;

  /** Protected constructor for JPA. */
  protected User() {}

  /**
   * Constructs a User with the specified details.
   *
   * @param uid the unique identifier
   * @param username the username
   * @param email the email address
   * @param passwordHash the password hash
   */
  public User(UUID uid, String username, String email, String passwordHash) {
    this.uid = uid;
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
  }

  /**
   * Gets the unique identifier.
   *
   * @return the uid
   */
  public UUID getUid() {
    return uid;
  }

  /**
   * Gets the username.
   *
   * @return the username
   */
  public String getUsername() {
    return username;
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
   * Gets the password hash.
   *
   * @return the password hash
   */
  public String getPasswordHash() {
    return passwordHash;
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
   * Sets the email.
   *
   * @param email the email to set
   */
  public void setEmail(String email) {
    this.email = email;
  }

  /**
   * Sets the password hash.
   *
   * @param passwordHash the password hash to set
   */
  public void setPasswordHash(String passwordHash) {
    this.passwordHash = passwordHash;
  }
}
