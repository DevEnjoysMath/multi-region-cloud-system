package com.sweng.backend.restaurant.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateRestaurantRequest {

  @NotBlank
  @Size(min = 1, max = 100)
  private String name;

  @Size(max = 500)
  private String description;

  @NotBlank
  @Size(max = 200)
  private String address;

  @Size(max = 20)
  private String phone;

  @Email private String email;

  @Size(max = 50)
  private String cuisineType;

  @Size(max = 100)
  private String openingHours;

  public CreateRestaurantRequest() {}

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
}
