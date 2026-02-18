package com.sweng.backend.restaurant;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "restaurants")
public class Restaurant {

  @Id
  private String id;

  @Column(nullable = false, length = 100)
  private String name;

  @Column(nullable = false, length = 200)
  private String address;

  @Column(length = 500)
  private String description;

  private String phone;
  private String email;
  private String cuisineType;
  private String openingHours;

  private String ownerId;

  private Boolean isActive;

  private OffsetDateTime createdAt;
  private OffsetDateTime updatedAt;

  @PrePersist
  public void prePersist() {
    if (id == null) id = UUID.randomUUID().toString();
    OffsetDateTime now = OffsetDateTime.now();
    createdAt = now;
    updatedAt = now;
    if (isActive == null) isActive = true;
  }

  @PreUpdate
  public void preUpdate() {
    updatedAt = OffsetDateTime.now();
  }

  // getters and setters
}
