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
   * @param registerRequest the register request containing user details
   * @return response entity containing the created user
   */
  @PostMapping("/register")
  public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
    try {
      User user =
          userService.registerUser(
              registerRequest.getUsername(),
              registerRequest.getEmail(),
              registerRequest.getPassword());

      UserDto dto = new UserDto();
      dto.setId(user.getUid().toString());
      dto.setUsername(user.getUsername());
      dto.setEmail(user.getEmail());
      dto.setFirstName(registerRequest.getFirstName());
      dto.setLastName(registerRequest.getLastName());
      dto.setRoles(user.getRoles().stream().map(r -> r.name()).toList());
      dto.setCreatedAt(user.getCreatedAt());

      return ResponseEntity.status(201).body(dto);
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  /**
   * Authenticates a user and returns a JWT token.
   *
   * @param loginRequest the login request containing credentials
   * @return response entity containing authentication details
   */
  @PostMapping("/login")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    try {
      Authentication authentication =
          authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(
                  loginRequest.getUsername(), loginRequest.getPassword()));

      String jwt = jwtUtil.generateToken(loginRequest.getUsername());

      User user = userService.findByUsername(loginRequest.getUsername());

      LoginResponse.UserDto userDto =
          new LoginResponse.UserDto(user.getUid().toString(), user.getUsername(), user.getEmail());

      LoginResponse response = new LoginResponse(jwt, 86400, userDto);

      return ResponseEntity.ok(response);

    } catch (Exception e) {
      return ResponseEntity.status(401).body("Invalid username or password");
    }
  }

  /**
   * Gets the current authenticated user profile.
   *
   * @param authentication the current authentication
   * @return response entity containing the current user
   */
  @GetMapping("/me")
  public ResponseEntity<?> getCurrentUser(Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
      return ResponseEntity.status(401).body("Unauthorized");
    }

    try {
      String username = authentication.getName();
      User user = userService.findByUsername(username);

      UserDto dto = new UserDto();
      dto.setId(user.getUid().toString());
      dto.setUsername(user.getUsername());
      dto.setEmail(user.getEmail());
      dto.setFirstName(null);
      dto.setLastName(null);
      dto.setRoles(user.getRoles().stream().map(r -> r.name()).toList());
      dto.setCreatedAt(user.getCreatedAt());

      return ResponseEntity.ok(dto);
    } catch (Exception e) {
      return ResponseEntity.status(401).body("Unauthorized");
    }
  }

  /**
   * Logs out the current user (client should discard token).
   *
   * @return response entity indicating logout success
   */
  @PostMapping("/logout")
  public ResponseEntity<?> logoutUser() {
    return ResponseEntity.ok("Logout successful");
  }
}
