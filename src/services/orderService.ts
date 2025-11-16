import axios from 'axios';
import type { Order, OrderItem, ShippingAddress } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface CreateOrderData {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'card' | 'paypal' | 'cod';
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  promoCode?: {
    code: string;
    discount: number;
    discountType: string;
  };
}

class OrderService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  // Create new order
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      const response = await axios.post<{ order: Order }>(
        `${API_URL}/orders`,
        orderData,
        { headers: this.getAuthHeader() }
      );
      return response.data.order;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(
        err.response?.data?.message || 'Erreur lors de la création de la commande'
      );
    }
  }

  // Get all orders for current user
  async getMyOrders(page = 1, limit = 10): Promise<{ orders: Order[], pagination: { pages: number, total: number } }> {
    try {
      const response = await axios.get<{ orders: Order[], pagination: { pages: number, total: number } }>(
        `${API_URL}/orders/my-orders?page=${page}&limit=${limit}`,
        { headers: this.getAuthHeader() }
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(
        err.response?.data?.message || 'Erreur lors de la récupération des commandes'
      );
    }
  }

  // Get single order by ID
  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await axios.get<{ order: Order }>(
        `${API_URL}/orders/${orderId}`,
        { headers: this.getAuthHeader() }
      );
      return response.data.order;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(
        err.response?.data?.message || 'Erreur lors de la récupération de la commande'
      );
    }
  }

  // Cancel order
  async cancelOrder(orderId: string): Promise<Order> {
    try {
      const response = await axios.put<{ order: Order }>(
        `${API_URL}/orders/${orderId}/cancel`,
        {},
        { headers: this.getAuthHeader() }
      );
      return response.data.order;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(
        err.response?.data?.message || 'Erreur lors de l\'annulation de la commande'
      );
    }
  }
}

export const orderService = new OrderService();
export default orderService;
