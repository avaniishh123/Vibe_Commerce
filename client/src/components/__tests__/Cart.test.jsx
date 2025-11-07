import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import Cart from '../Cart';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Cart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display loading state initially', () => {
    renderWithRouter(<Cart />);
    
    expect(screen.getByText('Loading your cart...')).toBeInTheDocument();
  });

  it('should display cart items after successful fetch', async () => {
    renderWithRouter(<Cart />);
    
    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    });
  });

  it('should display total cost correctly', async () => {
    renderWithRouter(<Cart />);
    
    await waitFor(() => {
      const amounts = screen.getAllByText('$49.98');
      expect(amounts.length).toBeGreaterThanOrEqual(2); // At least subtotal and total
    });
  });

  it('should display "Your cart is empty" when cart has no items', async () => {
    server.use(
      http.get('http://localhost:5000/api/cart', () => {
        return HttpResponse.json({
          success: true,
          data: {
            items: [],
            total: 0
          }
        });
      })
    );

    renderWithRouter(<Cart />);
    
    await waitFor(() => {
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });
  });

  it('should display "Continue Shopping" link when cart is empty', async () => {
    server.use(
      http.get('/api/cart', () => {
        return HttpResponse.json({
          success: true,
          data: {
            items: [],
            total: 0
          }
        });
      })
    );

    renderWithRouter(<Cart />);
    
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /continue shopping/i })).toBeInTheDocument();
    });
  });

  it('should display error message when fetch fails', async () => {
    server.use(
      http.get('http://localhost:5000/api/cart', () => {
        return HttpResponse.json(
          { success: false, error: 'Failed to load cart' },
          { status: 500 }
        );
      })
    );

    renderWithRouter(<Cart />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load cart/i)).toBeInTheDocument();
    });
  });

  it('should display "Proceed to Checkout" button when cart has items', async () => {
    renderWithRouter(<Cart />);
    
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /proceed to checkout/i })).toBeInTheDocument();
    });
  });

  it('should display success toast when item is removed', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Cart />);
    
    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    });

    const removeButton = screen.getByRole('button', { name: /remove item from cart/i });
    await user.click(removeButton);

    await waitFor(() => {
      expect(screen.getByText('Item removed from cart')).toBeInTheDocument();
    });
  });

  it('should refetch cart after removing an item', async () => {
    const user = userEvent.setup();
    let callCount = 0;

    server.use(
      http.get('http://localhost:5000/api/cart', () => {
        callCount++;
        if (callCount === 1) {
          return HttpResponse.json({
            success: true,
            data: {
              items: [
                {
                  _id: 'cart1',
                  productId: {
                    _id: '1',
                    name: 'Wireless Headphones',
                    price: 2499,
                    image: 'https://via.placeholder.com/300'
                  },
                  qty: 2
                }
              ],
              total: 4998
            }
          });
        }
        return HttpResponse.json({
          success: true,
          data: {
            items: [],
            total: 0
          }
        });
      })
    );

    renderWithRouter(<Cart />);
    
    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    });

    const removeButton = screen.getByRole('button', { name: /remove item from cart/i });
    await user.click(removeButton);

    await waitFor(() => {
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });
  });

  it('should display item count in order summary', async () => {
    renderWithRouter(<Cart />);
    
    await waitFor(() => {
      expect(screen.getByText(/items \(1\)/i)).toBeInTheDocument();
    });
  });

  it('should display free shipping message', async () => {
    renderWithRouter(<Cart />);
    
    await waitFor(() => {
      expect(screen.getByText('FREE')).toBeInTheDocument();
    });
  });

  it('should display success toast when cart is updated', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Cart />);
    
    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    });

    const incrementButton = screen.getByRole('button', { name: /increase quantity/i });
    await user.click(incrementButton);

    await waitFor(() => {
      expect(screen.getByText('Cart updated successfully')).toBeInTheDocument();
    });
  });
});
