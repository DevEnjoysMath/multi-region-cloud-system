export interface Order {
    id: number | string;
    restaurantId: number | string;
    total: number;
    status: "pending" | "completed" | "cancelled";
  }
  
  export interface Restaurant {
    id: string;
    name: string;
  }
  