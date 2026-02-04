package com.sweng.backend.user;

import jakarta.persistence.*;
import java.util.UUID;

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

    protected User() {}

    public User(UUID uid, String username, String email, String passwordHash) {
        this.uid = uid;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    public UUID getUid() { return uid; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }

    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email) { this.email = email; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
}

