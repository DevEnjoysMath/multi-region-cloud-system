package com.sweng.backend.order;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * JPA entity representing a customer order.
 *
 * <p>Stores order header fields and embeds the list of ordered items via
 * {@link OrderItemEmbeddable}.</p>
 */
@Entity
@Table(name = "orders")
public class OrderEntity {

  /** Primary key for the order. */
  @Id
  @Column(nullable = false, updatable = false)
  private UUID id;

  /** Restaurant fulfilling this order. */
  @Column(nullable = false)
  private UUID restaurantId;

  /**
   * Authenticated customer who placed the order.
   *
   * <p>May be null for guest orders, per spec.</p>
   */
  @Column
  private UUID customerId;

  /** Customer display name (optional). */
  @Column(length = 100)
  private String customerName;

  /** Customer email for notifications (optional). */
  @Column(length = 255)
  private String customerEmail;

  /** Order status. */
  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private OrderStatus status = OrderStatus.pending;

  /** Total order amount. */
  @Column(nullable = false, precision = 12, scale = 2)
  private BigDecimal totalAmount = BigDecimal.ZERO;

  /** Special instructions (optional). */
  @Column(length = 500)
  private String specialInstructions;

  /** Creation timestamp. */
  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  /** Last update timestamp. */
  @Column(nullable = false)
  private Instant updatedAt;

  /** Items in this order. */
  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "order_items", joinColumns = @JoinColumn(name = "order_id"))
  private List<OrderItemEmbeddable> items = new ArrayList<>();

  /**
   * Lifecycle callback triggered before first persist.
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
    if (status == null) {
      status = OrderStatus.pending;
    }
    if (totalAmount == null) {
      totalAmount = BigDecimal.ZERO;
    }
    if (items == null) {
      items = new ArrayList<>();
    }
  }

  /**
   * Lifecycle callback triggered before update.
   * Updates {@code updatedAt}.
   */
  @PreUpdate
  void onUpdate() {
    updatedAt = Instant.now();
  }

  /** @return order ID */
  public UUID getId() {
    return id;
  }

  /** @param id order ID */
  public void setId(UUID id) {
    this.id = id;
  }

  /** @return restaurant ID */
  public UUID getRestaurantId() {
    return restaurantId;
  }

  /** @param restaurantId restaurant ID */
  public void setRestaurantId(UUID restaurantId) {
    this.restaurantId = restaurantId;
  }

  /** @return customer ID (may be null) */
  public UUID getCustomerId() {
    return customerId;
  }

  /** @param customerId customer ID (may be null) */
  public void setCustomerId(UUID customerId) {
    this.customerId = customerId;
  }

  /** @return customer name */
  public String getCustomerName() {
    return customerName;
  }

  /** @param customerName customer name */
  public void setCustomerName(String customerName) {
    this.customerName = customerName;
  }

  /** @return customer email */
  public String getCustomerEmail() {
    return customerEmail;
  }

  /** @param customerEmail customer email */
  public void setCustomerEmail(String customerEmail) {
    this.customerEmail = customerEmail;
  }

  /** @return status */
  public OrderStatus getStatus() {
    return status;
  }

  /** @param status status */
  public void setStatus(OrderStatus status) {
    this.status = status;
  }

  /** @return total amount */
  public BigDecimal getTotalAmount() {
    return totalAmount;
  }

  /** @param totalAmount total amount */
  public void setTotalAmount(BigDecimal totalAmount) {
    this.totalAmount = totalAmount;
  }

  /** @return special instructions */
  public String getSpecialInstructions() {
    return specialInstructions;
  }

  /** @param specialInstructions special instructions */
  public void setSpecialInstructions(String specialInstructions) {
    this.specialInstructions = specialInstructions;
  }

  /** @return created timestamp */
  public Instant getCreatedAt() {
    return createdAt;
  }

  /** @param createdAt created timestamp */
  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  /** @return updated timestamp */
  public Instant getUpdatedAt() {
    return updatedAt;
  }

  /** @param updatedAt updated timestamp */
  public void setUpdatedAt(Instant updatedAt) {
    this.updatedAt = updatedAt;
  }

  /** @return items list */
  public List<OrderItemEmbeddable> getItems() {
    return items;
  }

  /** @param items items list */
  public void setItems(List<OrderItemEmbeddable> items) {
    this.items = items;
  }
}
