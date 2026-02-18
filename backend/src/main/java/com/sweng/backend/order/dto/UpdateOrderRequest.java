package com.sweng.backend.order.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * Request body for updating an existing order.
 *
 * <p>Matches the OpenAPI {@code UpdateOrderRequest} schema.</p>
 */
public class UpdateOrderRequest {

  /** Optional updated customer name. */
  @Size(min = 1, max = 100)
  private String customerName;

  /** Optional updated customer email. */
  @Email
  private String customerEmail;

  /**
   * Optional updated list of items.
   *
   * <p>If provided, must contain at least one item.</p>
   */
  private List<CreateOrderItemRequest> items;

  /**
   * Optional new order status.
   *
   * <p>Allowed values: pending, preparing, ready, completed, cancelled.</p>
   */
  private String status;

  /** Optional updated special instructions. */
  @Size(max = 500)
  private String specialInstructions;

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

  /** @return status */
  public String getStatus() {
    return status;
  }

  /** @param status status */
  public void setStatus(String status) {
    this.status = status;
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
