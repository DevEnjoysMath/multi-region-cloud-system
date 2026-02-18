package com.sweng.backend.order;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.math.BigDecimal;

/**
 * Embeddable representation of a single item within an order.
 *
 * <p>Stored in the {@code order_items} collection table.</p>
 */
@Embeddable
public class OrderItemEmbeddable {

  /** Identifier of the menu item. */
  @Column(nullable = false)
  private String itemId;

  /** Display name of the item. */
  @Column(nullable = false, length = 200)
  private String name;

  /** Quantity ordered (minimum 1). */
  @Column(nullable = false)
  private int quantity;

  /** Price per unit. */
  @Column(nullable = false, precision = 12, scale = 2)
  private BigDecimal unitPrice;

  /** Subtotal for this item (quantity × unitPrice). */
  @Column(nullable = false, precision = 12, scale = 2)
  private BigDecimal subtotal;

  /** @return item ID */
  public String getItemId() {
    return itemId;
  }

  /** @param itemId item ID */
  public void setItemId(String itemId) {
    this.itemId = itemId;
  }

  /** @return item name */
  public String getName() {
    return name;
  }

  /** @param name item name */
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

  /** @return unit price */
  public BigDecimal getUnitPrice() {
    return unitPrice;
  }

  /** @param unitPrice unit price */
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
