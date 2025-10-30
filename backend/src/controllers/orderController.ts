import { Request, Response } from 'express';
import { Order } from '../models/Order';
import Product from '../models/Product';

export const orderController = {
  // Create new order
  createOrder: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const {
        items,
        shippingAddress,
        billingAddress,
        paymentMethod,
        notes
      } = req.body;

      // Validate items and calculate totals
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({ error: `Product ${item.productId} not found` });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({ 
            error: `Insufficient stock for ${product.name}. Only ${product.stock} available.` 
          });
        }

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.images[0]?.url || ''
        });
      }

      // Calculate tax and shipping
      const tax = subtotal * 0.08; // 8% tax
      const shippingCost = subtotal > 50 ? 0 : 10; // Free shipping over $50
      const total = subtotal + tax + shippingCost;

      // Create order
      const order = await Order.create({
        user: userId,
        items: orderItems,
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'pending',
        subtotal,
        tax,
        shippingCost,
        discount: 0,
        total,
        notes
      });

      // Update product stock
      for (const item of items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } }
        );
      }

      res.status(201).json({
        success: true,
        order
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error creating order' });
    }
  },

  // Get all orders for current user
  getUserOrders: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const orders = await Order.find({ user: userId })
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .populate('items.product', 'name images');

      const total = await Order.countDocuments({ user: userId });

      res.json({
        orders,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error fetching orders' });
    }
  },

  // Get single order
  getOrderById: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const orderId = req.params.id;

      const order = await Order.findOne({ _id: orderId, user: userId })
        .populate('items.product', 'name images price');

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json({ order });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error fetching order' });
    }
  },

  // Cancel order
  cancelOrder: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const orderId = req.params.id;
      const { reason } = req.body;

      const order = await Order.findOne({ _id: orderId, user: userId });
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Can only cancel pending or processing orders
      if (!['pending', 'processing'].includes(order.orderStatus)) {
        return res.status(400).json({ 
          error: 'Order cannot be cancelled at this stage' 
        });
      }

      // Restore product stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity } }
        );
      }

      order.orderStatus = 'cancelled';
      order.cancelledAt = new Date();
      order.cancellationReason = reason;
      await order.save();

      res.json({
        success: true,
        message: 'Order cancelled successfully',
        order
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error cancelling order' });
    }
  },

  // Get all orders (Admin only)
  getAllOrders: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;
      const status = req.query.status as string;

      const query: any = {};
      if (status) {
        query.orderStatus = status;
      }

      const orders = await Order.find(query)
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .populate('user', 'firstName lastName email')
        .populate('items.product', 'name');

      const total = await Order.countDocuments(query);

      res.json({
        orders,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error fetching orders' });
    }
  },

  // Update order status (Admin only)
  updateOrderStatus: async (req: Request, res: Response) => {
    try {
      const orderId = req.params.id;
      const { orderStatus, trackingNumber } = req.body;

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      order.orderStatus = orderStatus || order.orderStatus;
      
      if (trackingNumber) {
        order.trackingNumber = trackingNumber;
      }

      if (orderStatus === 'delivered') {
        order.deliveredAt = new Date();
      }

      await order.save();

      res.json({
        success: true,
        message: 'Order status updated',
        order
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error updating order' });
    }
  },

  // Get order statistics (Admin only)
  getOrderStats: async (req: Request, res: Response) => {
    try {
      const totalOrders = await Order.countDocuments();
      const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
      const processingOrders = await Order.countDocuments({ orderStatus: 'processing' });
      const shippedOrders = await Order.countDocuments({ orderStatus: 'shipped' });
      const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
      const cancelledOrders = await Order.countDocuments({ orderStatus: 'cancelled' });

      // Calculate total revenue
      const revenueData = await Order.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
      ]);
      const totalRevenue = revenueData[0]?.totalRevenue || 0;

      res.json({
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error fetching statistics' });
    }
  }
};