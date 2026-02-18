package com.sweng.backend.order.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

/**
 * DTO representing an order in API responses.
 *
 * <p>Matches the OpenAPI {@code Order} schema.</p>
 */
public class OrderDto {

  /** Unique order identifier (UUID as string). */
  private String id;

  /** Restaurant ID fulfilling the order (UUID as string). */
  private String restaurantId;

  /** Customer ID who placed the order (UUID as string, may be null). */
  private String customerId;

  /** Customer name (optional). */
  private String customerName;

  /** Customer email (optional). */
  private String customerEmail;

  /** List of items in the order. */
  private List<OrderItemDto> items;

  /** Current order status. */
  private String status;

  /** Total order amount. */
  private BigDecimal totalAmount;

  /** Special instructions (optional). */
  private String specialInstructions;

  /** Creation timestamp. */
  private OffsetDateTime createdAt;

  /** Last update timestamp. */
  private OffsetDateTime updatedAt;

  /** @return id */
  public String getId() {
    return id;
  }

  /** @param id id */
  public void setId(String id) {
    this.id = id;
  }

  /** @return restaurantId */
  public String getRestaurantId() {
    return restaurantId;
  }

  /** @param restaurantId restaurantId */
  public void setRestaurantId(String restaurantId) {
    this.restaurantId = restaurantId;
  }

  /** @return customerId */
  public String getCustomerId() {
    return customerId;
  }

  /** @param customerId customerId */
  public void setCustomerId(String customerId) {
    this.customerId = customerId;
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
  public List<OrderItemDto> getItems() {
    return items;
  }

  /** @param items items */
  public void setItems(List<OrderItemDto> items) {
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

  /** @return totalAmount */
  public BigDecimal getTotalAmount() {
    return totalAmount;
  }

  /** @param totalAmount totalAmount */
  public void setTotalAmount(BigDecimal totalAmount) {
    this.totalAmount = totalAmount;
  }

  /** @return specialInstructions */
  public String getSpecialInstructions() {
    return specialInstructions;
  }

  /** @param specialInstructions specialInstructions */
  public void setSpecialInstructions(String specialInstructions) {
    this.specialInstructions = specialInstructions;
  }

  /** @return createdAt */
  public OffsetDateTime getCreatedAt() {
    return createdAt;
  }

  /** @param createdAt createdAt */
  public void setCreatedAt(OffsetDateTime createdAt) {
    this.createdAt = createdAt;
  }

  /** @return updatedAt */
  public OffsetDateTime getUpdatedAt() {
    return updatedAt;
  }

  /** @param updatedAt updatedAt */
  public void setUpdatedAt(OffsetDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }
}
