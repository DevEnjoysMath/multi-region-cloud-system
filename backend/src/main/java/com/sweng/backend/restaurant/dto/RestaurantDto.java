package com.sweng.backend.restaurant.dto;

import java.time.OffsetDateTime;

public class RestaurantDto {
  private String id;
  private String name;
  private String description;
  private String address;
  private String phone;
  private String email;
  private String cuisineType;
  private String openingHours;
  private String ownerId;
  private Boolean isActive;
  private OffsetDateTime createdAt;
  private OffsetDateTime updatedAt;

  public RestaurantDto() {}

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getCuisineType() {
    return cuisineType;
  }

  public void setCuisineType(String cuisineType) {
    this.cuisineType = cuisineType;
  }

  public String getOpeningHours() {
    return openingHours;
  }

  public void setOpeningHours(String openingHours) {
    this.openingHours = openingHours;
  }

  public String getOwnerId() {
    return ownerId;
  }

  public void setOwnerId(String ownerId) {
    this.ownerId = ownerId;
  }

  public Boolean getIsActive() {
    return isActive;
  }

  public void setIsActive(Boolean active) {
    isActive = active;
  }

  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(OffsetDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public OffsetDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(OffsetDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }
}
