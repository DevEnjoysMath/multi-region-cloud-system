package com.sweng.backend.auth;

import com.sweng.backend.user.User;
import com.sweng.backend.user.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/** REST controller for handling authentication-related requests. */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthenticationManager authenticationManager;
  private final UserService userService;
  private final JwtUtil jwtUtil;

  /**
   * Constructs an AuthController with required dependencies.
   *
   * @param authenticationManager the authentication manager
   * @param userService the user service
   * @param jwtUtil the JWT utility
   */
  public AuthController(
      AuthenticationManager authenticationManager, UserService userService, JwtUtil jwtUtil) {
    this.authenticationManager = authenticationManager;
    this.userService = userService;
    this.jwtUtil = jwtUtil;
  }

  /**
   * Registers a new user.
   *
   * @param signupRequest the signup request containing user details
   * @return response entity indicating success or failure
   */
  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
    try {
      User user =
          userService.registerUser(
              signupRequest.getUsername(), signupRequest.getEmail(), signupRequest.getPassword());
      return ResponseEntity.ok("User registered successfully!");
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  /**
   * Authenticates a user and returns a JWT token.
   *
   * @param loginRequest the login request containing credentials
   * @return response entity containing JWT token or error message
   */
  @PostMapping("/login")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    try {
      Authentication authentication =
          authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(
                  loginRequest.getUsername(), loginRequest.getPassword()));

      String jwt = jwtUtil.generateToken(loginRequest.getUsername());
      return ResponseEntity.ok(new JwtResponse(jwt, loginRequest.getUsername()));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Invalid username or password");
    }
  }
}
