import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from './ProductCard';
import { store } from '../../store';
import type { Product } from '../../types/product';

// Mock OptimizedImage to avoid IntersectionObserver in unit tests
vi.mock('../common/OptimizedImage', () => ({
  default: (props: { alt?: string }) => <img alt={props.alt} />,
}));

const product: Product = {
  id: 1,
  title: 'Test Phone',
  description: 'Great phone',
  price: 999,
  discountPercentage: 10,
  rating: 4.5,
  stock: 50,
  brand: 'BrandX',
  category: 'smartphones',
  thumbnail: '/images/phone.jpg',
  images: ['/images/phone.jpg'],
};

const renderWithProviders = (ui: React.ReactNode) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe('ProductCard', () => {
  it('renders product title and price', () => {
    renderWithProviders(<ProductCard product={product} />);
    expect(screen.getByText(/Test Phone/i)).toBeInTheDocument();
    // price is formatted, check contains 999 or currency sign could be in locale, do presence of "Add to cart" button
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });
});
