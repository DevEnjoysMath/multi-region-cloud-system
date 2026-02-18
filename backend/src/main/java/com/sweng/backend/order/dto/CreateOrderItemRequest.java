package com.sweng.backend.order.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

/**
 * Request body for an individual item within a create order request.
 *
 * <p>Matches the nested item structure in the OpenAPI {@code CreateOrderRequest} schema.</p>
 */
public class CreateOrderItemRequest {

  /** ID of the menu item. */
  @NotBlank
  private String itemId;

  /** Quantity ordered (minimum 1). */
  @Min(1)
  private int quantity;

  /** @return itemId */
  public String getItemId() {
    return itemId;
  }

  /** @param itemId itemId */
  public void setItemId(String itemId) {
    this.itemId = itemId;
  }

  /** @return quantity */
  public int getQuantity() {
    return quantity;
  }

  /** @param quantity quantity */
  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }
}
