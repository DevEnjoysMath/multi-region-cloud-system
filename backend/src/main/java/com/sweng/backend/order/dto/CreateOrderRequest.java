package com.sweng.backend.order.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * Request body for creating a new order.
 *
 * <p>Matches the OpenAPI {@code CreateOrderRequest} schema.</p>
 */
public class CreateOrderRequest {

  /** Restaurant ID to place the order with (UUID as string). */
  @NotNull
  private String restaurantId;

  /** Optional customer name (for guest or display). */
  @Size(min = 1, max = 100)
  private String customerName;

  /** Optional customer email. */
  @Email
  private String customerEmail;

  /** List of items to order (must contain at least one item). */
  @NotEmpty
  private List<CreateOrderItemRequest> items;

  /** Optional special instructions. */
  @Size(max = 500)
  private String specialInstructions;

  /** @return restaurantId */
  public String getRestaurantId() {
    return restaurantId;
  }

  /** @param restaurantId restaurantId */
  public void setRestaurantId(String restaurantId) {
    this.restaurantId = restaurantId;
  }

  /** @return customerName */
  public String getCustomerName() {
    return customerName;
  }

  /** @param customerName customerName */
  public void setCustomerName(String customerName) {
    this.customerName = customerName;
  }

  /** @return customerEmail */
  public String getCustomerEmail() {
    return customerEmail;
  }

  /** @param customerEmail customerEmail */
  public void setCustomerEmail(String customerEmail) {
    this.customerEmail = customerEmail;
  }

  /** @return items */
  public List<CreateOrderItemRequest> getItems() {
    return items;
  }

  /** @param items items */
  public void setItems(List<CreateOrderItemRequest> items) {
    this.items = items;
  }

  /** @return specialInstructions */
  public String getSpecialInstructions() {
    return specialInstructions;
  }

  /** @param specialInstructions specialInstructions */
  public void setSpecialInstructions(String specialInstructions) {
    this.specialInstructions = specialInstructions;
  }
}
