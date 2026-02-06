package com.sweng.backend.auth;

public class JwtResponse {
  private String token;
  private String type = "Bearer";
  private String username;

  public JwtResponse(String token, String username) {
    this.token = token;
    this.username = username;
  }

  public String getToken() {
    return token;
  }

  public String getType() {
    return type;
  }

  public String getUsername() {
    return username;
  }
}
