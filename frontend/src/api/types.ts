export interface Restaurant 
{
    id: string;
    name: string;
    cuisine: string;
    location: string;
    region: string;
    rating: number;
    description?: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Order 
  {
    id: string;
    restaurantId: string;
    customerId: string;
    items: OrderItem[];
    status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface OrderItem 
  {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }
  
  export interface ApiError 
  {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
  }
  
  export interface PaginatedResponse<T> 
  {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
  }