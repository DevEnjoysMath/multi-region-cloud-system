import { describe, it, expect } from "bun:test";
import { mockRestaurants } from "./mock";

describe("API mocks", () => {
  it("returns mock restaurant data", () => {
    expect(mockRestaurants.length).toBeGreaterThan(0);
    expect(mockRestaurants[0] && mockRestaurants[0].name).toBeDefined();
  });
});
