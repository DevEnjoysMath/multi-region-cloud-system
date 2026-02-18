package com.sweng.backend.order.dto;

import java.math.BigDecimal;

/**
 * DTO representing an individual item in an order.
 *
 * <p>Matches the OpenAPI {@code OrderItem} schema.</p>
 */
public class OrderItemDto {

  /** Menu item identifier. */
  private String itemId;

  /** Menu item name. */
  private String name;

  /** Quantity ordered (minimum 1). */
  private int quantity;

  /** Unit price in dollars. */
  private BigDecimal unitPrice;

  /** Subtotal for this item (quantity × unitPrice). */
  private BigDecimal subtotal;

  /** @return itemId */
  public String getItemId() {
    return itemId;
  }

  /** @param itemId itemId */
  public void setItemId(String itemId) {
    this.itemId = itemId;
  }

  /** @return name */
  public String getName() {
    return name;
  }

  /** @param name name */
  public void setName(String name) {
    this.name = name;
  }

  /** @return quantity */
  public int getQuantity() {
    return quantity;
  }

  /** @param quantity quantity */
  public void setQuantity(int quantity) {
    this.quantity = quantity;
  }

  /** @return unitPrice */
  public BigDecimal getUnitPrice() {
    return unitPrice;
  }

  /** @param unitPrice unitPrice */
  public void setUnitPrice(BigDecimal unitPrice) {
    this.unitPrice = unitPrice;
  }

  /** @return subtotal */
  public BigDecimal getSubtotal() {
    return subtotal;
  }

  /** @param subtotal subtotal */
  public void setSubtotal(BigDecimal subtotal) {
    this.subtotal = subtotal;
  }
}
