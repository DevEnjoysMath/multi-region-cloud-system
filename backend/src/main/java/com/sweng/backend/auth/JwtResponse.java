package com.sweng.backend.auth;

/** Response object containing JWT authentication details. */
public class JwtResponse {
  private String token;
  private String type = "Bearer";
  private String username;

  /**
   * Constructs a JwtResponse with the token and username.
   *
   * @param token the JWT token
   * @param username the username
   */
  public JwtResponse(String token, String username) {
    this.token = token;
    this.username = username;
  }

  /**
   * Gets the JWT token.
   *
   * @return the token
   */
  public String getToken() {
    return token;
  }

  /**
   * Gets the token type.
   *
   * @return the token type
   */
  public String getType() {
    return type;
  }

  /**
   * Gets the username.
   *
   * @return the username
   */
  public String getUsername() {
    return username;
  }
}
