import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import ProductGrid from '../ProductGrid';

describe('ProductGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display loading state initially', () => {
    render(<ProductGrid />);
    
    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });

  it('should display products after successful fetch', async () => {
    render(<ProductGrid />);
    
    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      expect(screen.getByText('Smart Watch')).toBeInTheDocument();
    });
  });

  it('should display error message when fetch fails', async () => {
    server.use(
      http.get('http://localhost:5000/api/products', () => {
        return HttpResponse.json(
          { success: false, error: 'Failed to fetch products' },
          { status: 500 }
        );
      })
    );

    render(<ProductGrid />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch products/i)).toBeInTheDocument();
    });
  });

  it('should display "Try Again" button on error', async () => {
    server.use(
      http.get('http://localhost:5000/api/products', () => {
        return HttpResponse.json(
          { success: false, error: 'Network error' },
          { status: 500 }
        );
      })
    );

    render(<ProductGrid />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });
  });

  it('should retry fetching products when "Try Again" is clicked', async () => {
    const user = userEvent.setup();
    let callCount = 0;

    server.use(
      http.get('http://localhost:5000/api/products', () => {
        callCount++;
        if (callCount === 1) {
          return HttpResponse.json(
            { success: false, error: 'Network error' },
            { status: 500 }
          );
        }
        return HttpResponse.json({
          success: true,
          data: [
            {
              _id: '1',
              name: 'Wireless Headphones',
              price: 2499,
              image: 'https://via.placeholder.com/300',
              stock: 15
            }
          ]
        });
      })
    );

    render(<ProductGrid />);
    
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });

    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    await user.click(tryAgainButton);

    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    });
  });

  it('should display "No products available" when products array is empty', async () => {
    server.use(
      http.get('http://localhost:5000/api/products', () => {
        return HttpResponse.json({
          success: true,
          data: []
        });
      })
    );

    render(<ProductGrid />);
    
    await waitFor(() => {
      expect(screen.getByText('No products available')).toBeInTheDocument();
    });
  });

  it('should display success toast when item is added to cart', async () => {
    const user = userEvent.setup();
    render(<ProductGrid />);
    
    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    });

    const addToCartButtons = screen.getAllByRole('button', { name: /add.*to cart/i });
    await user.click(addToCartButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Item added to cart successfully!')).toBeInTheDocument();
    });
  });

  it('should display error toast when add to cart fails', async () => {
    const user = userEvent.setup();
    
    server.use(
      http.post('http://localhost:5000/api/cart', () => {
        return HttpResponse.json(
          { success: false, error: 'Failed to add to cart' },
          { status: 500 }
        );
      })
    );

    render(<ProductGrid />);
    
    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    });

    const addToCartButtons = screen.getAllByRole('button', { name: /add.*to cart/i });
    await user.click(addToCartButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/failed to add to cart/i)).toBeInTheDocument();
    });
  });

  it('should render products in a grid layout', async () => {
    render(<ProductGrid />);
    
    await waitFor(() => {
      const productCards = screen.getAllByRole('button', { name: /add.*to cart/i });
      expect(productCards).toHaveLength(2);
    });
  });
});
