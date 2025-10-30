import { Request, Response } from 'express';
import { Order } from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';

// @desc    Create new order from cart
// @route   POST /api/client-orders
// @access  Private (Client)
export const createOrder = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).user?.id;
    const { shippingAddress, billingAddress, paymentMethod, notes } = req.body;

    // Validation
    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required',
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required',
      });
    }

    // Get user cart
    const cart = await Cart.findOne({ client: clientId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    // Verify stock for all items
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.name} not found`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.name}. Available: ${product.stock}`,
        });
      }
    }

    // Calculate totals
    const subtotal = cart.totalPrice;
    const shippingCost = subtotal >= 50 ? 0 : 9.99;
    const tax = subtotal * 0.08; // 8% tax
    const discount = 0; // Can be implemented later
    const total = subtotal + shippingCost + tax - discount;

    // Generate order number
    const orderNumber = 'ORD-' + Date.now().toString().slice(-8);

    // Create order
    const order = await Order.create({
      user: clientId,
      orderNumber,
      items: cart.items.map((item) => ({
        product: item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      subtotal,
      tax,
      shippingCost,
      discount,
      total,
      notes,
    });

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        items: order.items,
        shippingAddress: order.shippingAddress,
        createdAt: (order as any).createdAt,
      },
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get all orders for logged in client
// @route   GET /api/client-orders
// @access  Private (Client)
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: clientId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await Order.countDocuments({ user: clientId });

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get single order by ID
// @route   GET /api/client-orders/:id
// @access  Private (Client)
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).user?.id;
    const { id } = req.params;

    const order = await Order.findById(id).populate('items.product', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify order belongs to client
    if (order.user.toString() !== clientId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/client-orders/:id/cancel
// @access  Private (Client)
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).user?.id;
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify order belongs to client
    if (order.user.toString() !== clientId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order',
      });
    }

    // Check if order can be cancelled
    if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.orderStatus}`,
      });
    }

    if (order.orderStatus === 'shipped') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order that has already been shipped',
      });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    // Update order
    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason || 'Cancelled by customer';
    await order.save();

    res.status(200).json({
      success: true,
      order,
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
