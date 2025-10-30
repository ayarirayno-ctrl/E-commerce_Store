import cartReducer, { addToCart, clearCart, updateQuantity, removeFromCart } from './cartSlice';
import type { CartState } from '../../types/cart';
import type { Product } from '../../types/product';

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 1,
  title: 'Test Phone',
  description: 'A great phone',
  price: 1000,
  discountPercentage: 0,
  rating: 4.5,
  stock: 10,
  brand: 'BrandX',
  category: 'smartphones',
  thumbnail: '/images/phone.jpg',
  images: ['/images/phone.jpg'],
  ...overrides,
});

const initialState: CartState = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
  isOpen: false,
};

describe('cartSlice reducers', () => {
  it('should add product to cart and update totals', () => {
    const product = makeProduct();
    const state = cartReducer(initialState, addToCart({ product, quantity: 2 }));
    expect(state.items).toHaveLength(1);
    expect(state.totalItems).toBe(2);
    expect(state.totalPrice).toBe(2000);
  });

  it('should update quantity and totals', () => {
    const product = makeProduct();
    let state = cartReducer(initialState, addToCart({ product, quantity: 1 }));
    state = cartReducer(state, updateQuantity({ id: product.id, quantity: 3 }));
    expect(state.totalItems).toBe(3);
    expect(state.totalPrice).toBe(3000);
  });

  it('should remove item when quantity set to 0', () => {
    const product = makeProduct();
    let state = cartReducer(initialState, addToCart({ product, quantity: 1 }));
    state = cartReducer(state, updateQuantity({ id: product.id, quantity: 0 }));
    expect(state.items).toHaveLength(0);
    expect(state.totalItems).toBe(0);
    expect(state.totalPrice).toBe(0);
  });

  it('should remove item by id', () => {
    const product = makeProduct();
    let state = cartReducer(initialState, addToCart({ product, quantity: 1 }));
    state = cartReducer(state, removeFromCart(product.id));
    expect(state.items).toHaveLength(0);
  });

  it('should clear cart', () => {
    const product = makeProduct();
    let state = cartReducer(initialState, addToCart({ product, quantity: 2 }));
    state = cartReducer(state, clearCart());
    expect(state.items).toHaveLength(0);
    expect(state.totalItems).toBe(0);
    expect(state.totalPrice).toBe(0);
  });
});
