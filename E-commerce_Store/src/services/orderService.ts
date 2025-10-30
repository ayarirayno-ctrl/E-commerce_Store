import api from '../lib/api';
import { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types
export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CreateOrderData {
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  notes?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface OrderResponse {
  success: boolean;
  order: Order;
  message?: string;
}

class OrderService {
  // Create new order
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      const response = await api.post<OrderResponse>(
        `${API_URL}/client-orders`,
        orderData
      );
      return response.data.order;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message || 'Failed to create order'
      );
    }
  }

  // Get all orders for current user
  async getMyOrders(page = 1, limit = 10): Promise<OrdersResponse> {
    try {
      const response = await api.get<OrdersResponse>(
        `${API_URL}/client-orders`,
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message || 'Failed to fetch orders'
      );
    }
  }

  // Get single order by ID
  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await api.get<OrderResponse>(
        `${API_URL}/client-orders/${orderId}`
      );
      return response.data.order;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message || 'Failed to fetch order details'
      );
    }
  }

  // Cancel order
  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    try {
      const response = await api.put<OrderResponse>(
        `${API_URL}/client-orders/${orderId}/cancel`,
        { reason }
      );
      return response.data.order;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      throw new Error(
        axiosError.response?.data?.message || 'Failed to cancel order'
      );
    }
  }
}

export const orderService = new OrderService();
export default orderService;
