package com.sweng.backend.user;

import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public User registerUser(String username, String email, String password) {
    if (userRepository.existsByUsername(username)) {
      throw new RuntimeException("Username already exists");
    }
    if (userRepository.existsByEmail(email)) {
      throw new RuntimeException("Email already exists");
    }

    String hashedPassword = passwordEncoder.encode(password);
    User user = new User(UUID.randomUUID(), username, email, hashedPassword);
    return userRepository.save(user);
  }

  public User findByUsername(String username) {
    return userRepository
        .findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));
  }
}
