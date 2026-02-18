package com.sweng.backend.auth;

/** Response containing authentication token and user information. */
public class LoginResponse {

  private String accessToken;
  private String tokenType = "Bearer";
  private int expiresIn;
  private UserDto user;

  /** Constructs a LoginResponse with default values. */
  public LoginResponse() {}

  /**
   * Constructs a LoginResponse with the specified values.
   *
   * @param accessToken the JWT access token
   * @param expiresIn the token expiration time in seconds
   * @param user the authenticated user information
   */
  public LoginResponse(String accessToken, int expiresIn, UserDto user) {
    this.accessToken = accessToken;
    this.expiresIn = expiresIn;
    this.user = user;
  }

  /**
   * Gets the access token.
   *
   * @return the access token
   */
  public String getAccessToken() {
    return accessToken;
  }

  /**
   * Sets the access token.
   *
   * @param accessToken the access token to set
   */
  public void setAccessToken(String accessToken) {
    this.accessToken = accessToken;
  }

  /**
   * Gets the token type.
   *
   * @return the token type
   */
  public String getTokenType() {
    return tokenType;
  }

  /**
   * Sets the token type.
   *
   * @param tokenType the token type to set
   */
  public void setTokenType(String tokenType) {
    this.tokenType = tokenType;
  }

  /**
   * Gets the expiration time in seconds.
   *
   * @return the expiration time
   */
  public int getExpiresIn() {
    return expiresIn;
  }

  /**
   * Sets the expiration time in seconds.
   *
   * @param expiresIn the expiration time to set
   */
  public void setExpiresIn(int expiresIn) {
    this.expiresIn = expiresIn;
  }

  /**
   * Gets the user information.
   *
   * @return the user information
   */
  public UserDto getUser() {
    return user;
  }

  /**
   * Sets the user information.
   *
   * @param user the user to set
   */
  public void setUser(UserDto user) {
    this.user = user;
  }

  /** DTO representing user information in login response. */
  public static class UserDto {

    private String id;
    private String username;
    private String email;

    /** Constructs a UserDto with default values. */
    public UserDto() {}

    /**
     * Constructs a UserDto with the specified values.
     *
     * @param id the user identifier
     * @param username the username
     * @param email the email address
     */
    public UserDto(String id, String username, String email) {
      this.id = id;
      this.username = username;
      this.email = email;
    }

    /**
     * Gets the user identifier.
     *
     * @return the user identifier
     */
    public String getId() {
      return id;
    }

    /**
     * Sets the user identifier.
     *
     * @param id the identifier to set
     */
    public void setId(String id) {
      this.id = id;
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
  }
}
