package com.sweng.backend.restaurant;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * JPA entity representing a restaurant in the system.
 *
 * <p>This entity maps to the {@code restaurants} table and stores
 * business information such as name, address, contact details,
 * ownership, and lifecycle timestamps.</p>
 */
@Entity
@Table(name = "restaurants")
public class RestaurantEntity {

  /** Unique identifier for the restaurant (UUID primary key). */
  @Id
  @Column(nullable = false, updatable = false)
  private UUID id;

  /** Business name of the restaurant. */
  @Column(nullable = false, length = 100)
  private String name;

  /** Optional description of the restaurant. */
  @Column(length = 500)
  private String description;

  /** Physical address of the restaurant. */
  @Column(nullable = false, length = 200)
  private String address;

  /** Optional contact phone number. */
  @Column(length = 20)
  private String phone;

  /** Optional contact email address. */
  @Column(length = 255)
  private String email;

  /** Type of cuisine served by the restaurant. */
  @Column(length = 50)
  private String cuisineType;

  /** Opening hours of the restaurant. */
  @Column(length = 100)
  private String openingHours;

  /** UUID of the user who owns the restaurant. */
  @Column(nullable = false)
  private UUID ownerId;

  /** Indicates whether the restaurant is active and accepting orders. */
  @Column(nullable = false)
  private boolean isActive = true;

  /** Timestamp when the restaurant was created. */
  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  /** Timestamp when the restaurant was last updated. */
  @Column(nullable = false)
  private Instant updatedAt;

  /**
   * Lifecycle callback triggered before the entity is first persisted.
   * Initializes ID and timestamps.
   */
  @PrePersist
  void onCreate() {
    if (id == null) {
      id = UUID.randomUUID();
    }
    Instant now = Instant.now();
    createdAt = now;
    updatedAt = now;
  }

  /**
   * Lifecycle callback triggered before the entity is updated.
   * Updates the {@code updatedAt} timestamp.
   */
  @PreUpdate
  void onUpdate() {
    updatedAt = Instant.now();
  }

  /** @return the restaurant UUID */
  public UUID getId() {
    return id;
  }

  /** @param id the UUID to set */
  public void setId(UUID id) {
    this.id = id;
  }

  /** @return the restaurant name */
  public String getName() {
    return name;
  }

  /** @param name the restaurant name */
  public void setName(String name) {
    this.name = name;
  }

  /** @return the description */
  public String getDescription() {
    return description;
  }

  /** @param description the description */
  public void setDescription(String description) {
    this.description = description;
  }

  /** @return the address */
  public String getAddress() {
    return address;
  }

  /** @param address the physical address */
  public void setAddress(String address) {
    this.address = address;
  }

  /** @return the phone number */
  public String getPhone() {
    return phone;
  }

  /** @param phone the contact phone */
  public void setPhone(String phone) {
    this.phone = phone;
  }

  /** @return the email address */
  public String getEmail() {
    return email;
  }

  /** @param email the contact email */
  public void setEmail(String email) {
    this.email = email;
  }

  /** @return the cuisine type */
  public String getCuisineType() {
    return cuisineType;
  }

  /** @param cuisineType the cuisine type */
  public void setCuisineType(String cuisineType) {
    this.cuisineType = cuisineType;
  }

  /** @return the opening hours */
  public String getOpeningHours() {
    return openingHours;
  }

  /** @param openingHours the opening hours string */
  public void setOpeningHours(String openingHours) {
    this.openingHours = openingHours;
  }

  /** @return the owner UUID */
  public UUID getOwnerId() {
    return ownerId;
  }

  /** @param ownerId the owner UUID */
  public void setOwnerId(UUID ownerId) {
    this.ownerId = ownerId;
  }

  /** @return whether the restaurant is active */
  public boolean isActive() {
    return isActive;
  }

  /** @param active whether the restaurant is active */
  public void setActive(boolean active) {
    isActive = active;
  }

  /** @return creation timestamp */
  public Instant getCreatedAt() {
    return createdAt;
  }

  /** @param createdAt creation timestamp */
  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  /** @return last update timestamp */
  public Instant getUpdatedAt() {
    return updatedAt;
  }

  /** @param updatedAt last update timestamp */
  public void setUpdatedAt(Instant updatedAt) {
    this.updatedAt = updatedAt;
  }
}
