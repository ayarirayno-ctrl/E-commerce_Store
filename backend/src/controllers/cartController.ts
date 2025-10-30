import { Request, Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private (Client)
export const getCart = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).user?.id;

    let cart = await Cart.findOne({ client: clientId }).populate('items.product');

    if (!cart) {
      // Create empty cart if doesn't exist
      cart = await Cart.create({
        client: clientId,
        items: [],
        totalPrice: 0,
      });
    }

    res.status(200).json({
      success: true,
      cart: {
        items: cart.items,
        totalPrice: cart.totalPrice,
      },
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private (Client)
export const addToCart = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).user?.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
    }

    let cart = await Cart.findOne({ client: clientId });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        client: clientId,
        items: [],
      });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        name: product.name,
        image: (product.images[0] as any)?.url || '',
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      cart: {
        items: cart.items,
        totalPrice: cart.totalPrice,
      },
      message: 'Item added to cart',
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:productId
// @access  Private (Client)
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).user?.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    const cart = await Cart.findOne({ client: clientId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    // Verify stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({
      success: true,
      cart: {
        items: cart.items,
        totalPrice: cart.totalPrice,
      },
      message: 'Cart updated',
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private (Client)
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).user?.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ client: clientId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json({
      success: true,
      cart: {
        items: cart.items,
        totalPrice: cart.totalPrice,
      },
      message: 'Item removed from cart',
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private (Client)
export const clearCart = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).user?.id;

    const cart = await Cart.findOne({ client: clientId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({
      success: true,
      cart: {
        items: [],
        totalPrice: 0,
      },
      message: 'Cart cleared',
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
