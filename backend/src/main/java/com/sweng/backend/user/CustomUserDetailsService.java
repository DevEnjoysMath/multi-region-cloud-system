package com.sweng.backend.user;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/** Service for loading user details from the database. */
@Service
public class CustomUserDetailsService implements UserDetailsService {
  private final UserRepository userRepository;

  /**
   * Constructs a CustomUserDetailsService with the user repository.
   *
   * @param userRepository the user repository
   */
  public CustomUserDetailsService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

    var authorities =
        user.getRoles().stream()
            .map(
                role ->
                    new org.springframework.security.core.authority.SimpleGrantedAuthority(
                        "ROLE_" + role.name()))
            .toList();

    return new org.springframework.security.core.userdetails.User(
        user.getUsername(), user.getPasswordHash(), authorities);
  }
}
