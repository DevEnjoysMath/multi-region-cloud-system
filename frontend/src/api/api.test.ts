import { describe, it, expect } from "bun:test";
import { mockApi, mockRestaurants, mockOrders } from "./mock";

describe("API Tests", () => {
  describe("Restaurants API", () => {
    it("should fetch all restaurants", async () => {
      const result = await mockApi.restaurants.getAll();
      expect(result.data.length).toBe(mockRestaurants.length);
      expect(result.total).toBe(mockRestaurants.length);
    });

    it("should fetch restaurant by id", async () => {
      const restaurant = await mockApi.restaurants.getById("1");
      expect(restaurant).toBeDefined();
      expect(restaurant?.name).toBe("Pizza Palace");
    });

    it("should return undefined for non-existent restaurant", async () => {
      const restaurant = await mockApi.restaurants.getById("999");
      expect(restaurant).toBeUndefined();
    });
  });

  describe("Orders API", () => {
    it("should fetch all orders", async () => {
      const result = await mockApi.orders.getAll();
      expect(result.data.length).toBe(mockOrders.length);
      expect(result.total).toBe(mockOrders.length);
    });

    it("should fetch order by id", async () => {
      const order = await mockApi.orders.getById("1");
      expect(order).toBeDefined();
      expect(order?.restaurantId).toBe("1");
    });

    it("should calculate total amount correctly", async () => {
      const order = await mockApi.orders.getById("1");
      expect(order?.totalAmount).toBe(31.97);
    });
  });

  describe("Data validation", () => {
    it("restaurants should have required fields", () => {
      mockRestaurants.forEach((restaurant) => {
        expect(restaurant.id).toBeDefined();
        expect(restaurant.name).toBeDefined();
        expect(restaurant.cuisine).toBeDefined();
        expect(restaurant.region).toBeDefined();
      });
    });

    it("orders should have valid status", () => {
      const validStatuses = [
        "pending",
        "preparing",
        "ready",
        "delivered",
        "cancelled",
      ];
      mockOrders.forEach((order) => {
        expect(validStatuses.includes(order.status)).toBe(true);
      });
    });
  });
});
