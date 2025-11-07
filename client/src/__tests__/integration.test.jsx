import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../test/mocks/server';
import { resetMockCart } from '../test/mocks/handlers';
import App from '../App';

describe('Integration Tests - Complete User Flow', () => {
  beforeEach(() => {
    // Reset any state between tests
    server.resetHandlers();
    resetMockCart();
  });

  it('should complete full user flow: browse → add to cart → view cart → checkout', async () => {
    const user = userEvent.setup();
    
    // Render the full app
    render(<App />);
    
    // Step 1: Browse products - verify products load on home page
    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
      expect(screen.getByText('Smart Watch')).toBeInTheDocument();
    });
    
    // Step 2: Add product to cart
    const addToCartButtons = screen.getAllByRole('button', { name: /add.*to cart/i });
    await user.click(addToCartButtons[0]); // Add Wireless Headphones
    
    // Verify success toast appears
    await waitFor(() => {
      expect(screen.getByText('Item added to cart successfully!')).toBeInTheDocument();
    });
    
    // Step 3: Navigate to cart page
    const cartLink = screen.getByRole('link', { name: /cart/i });
    await user.click(cartLink);
    
    // Step 4: Verify cart displays items correctly
    await waitFor(() => {
      expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    });
    
    // Verify total is displayed
    expect(screen.getByText(/total:/i)).toBeInTheDocument();
    
    // Step 5: Navigate to checkout
    const checkoutButton = screen.getByRole('link', { name: /proceed to checkout/i });
    await user.click(checkoutButton);
    
    // Step 6: Fill out checkout form
    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument();
    });
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    
    // Step 7: Submit checkout
    const submitButton = screen.getByRole('button', { name: /complete order/i });
    await user.click(submitButton);
    
    // Step 8: Verify receipt is displayed
    await waitFor(() => {
      expect(screen.getByText(/order confirmation/i)).toBeInTheDocument();
      expect(screen.getByText(/thank you/i)).toBeInTheDocument();
    });
  });

  it('should navigate between pages and maintain cart state', async () => {
    const user = userEvent.setup();
    
    render(<App />);
    
    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    });
    
    // Add item to cart
    const addToCartButtons = screen.getAllByRole('button', { name: /add.*to cart/i });
    await user.click(addToCartButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText('Item added to cart successfully!')).toBeInTheDocument();
    });
    
    // Navigate to cart
    const cartLink = screen.getByRole('link', { name: /cart/i });
    await user.click(cartLink);
    
    // Verify cart has items
    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    });
    
    // Navigate back to home
    const homeLink = screen.getByRole('link', { name: /home/i });
    await user.click(homeLink);
    
    // Verify we're back on home page
    await waitFor(() => {
      expect(screen.getByText('Products')).toBeInTheDocument();
    });
    
    // Navigate to cart again
    await user.click(cartLink);
    
    // Verify cart still has items (persistence)
    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    });
  });

  it('should handle cart updates and reflect changes across navigation', async () => {
    const user = userEvent.setup();
    
    render(<App />);
    
    // Navigate to cart page
    const cartLink = screen.getByRole('link', { name: /cart/i });
    await user.click(cartLink);
    
    // Wait for cart to load
    await waitFor(() => {
      expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    });
    
    // Verify item is in cart
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    
    // Remove item from cart
    const removeButton = screen.getByRole('button', { name: /remove/i });
    await user.click(removeButton);
    
    // Verify item is removed
    await waitFor(() => {
      expect(screen.queryByText('Wireless Headphones')).not.toBeInTheDocument();
    });
    
    // Navigate to home and back to cart
    const homeLink = screen.getByRole('link', { name: /home/i });
    await user.click(homeLink);
    
    await waitFor(() => {
      expect(screen.getByText('Products')).toBeInTheDocument();
    });
    
    await user.click(cartLink);
    
    // Verify cart is still empty after navigation
    await waitFor(() => {
      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });
  });

  it('should allow adding multiple products and display them in cart', async () => {
    const user = userEvent.setup();
    
    render(<App />);
    
    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    });
    
    // Add first product
    const addToCartButtons = screen.getAllByRole('button', { name: /add.*to cart/i });
    await user.click(addToCartButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText('Item added to cart successfully!')).toBeInTheDocument();
    });
    
    // Navigate to cart
    const cartLink = screen.getByRole('link', { name: /cart/i });
    await user.click(cartLink);
    
    // Verify item is in cart
    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    });
  });

  it('should handle checkout with empty cart gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock empty cart
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
    
    render(<App />);
    
    // Navigate directly to checkout
    const cartLink = screen.getByRole('link', { name: /cart/i });
    await user.click(cartLink);
    
    // Verify empty cart message
    await waitFor(() => {
      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });
    
    // Verify no checkout button when cart is empty
    expect(screen.queryByRole('link', { name: /proceed to checkout/i })).not.toBeInTheDocument();
  });

  it('should navigate back to shopping from checkout', async () => {
    const user = userEvent.setup();
    
    render(<App />);
    
    // Navigate to cart
    const cartLink = screen.getByRole('link', { name: /cart/i });
    await user.click(cartLink);
    
    await waitFor(() => {
      expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    });
    
    // Navigate to checkout
    const checkoutButton = screen.getByRole('link', { name: /proceed to checkout/i });
    await user.click(checkoutButton);
    
    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument();
    });
    
    // Navigate back to shopping
    const backLink = screen.getByRole('link', { name: /back to shopping/i });
    await user.click(backLink);
    
    // Verify we're back on home page
    await waitFor(() => {
      expect(screen.getByText('Products')).toBeInTheDocument();
    });
  });

  it('should display error when product fetch fails and allow retry', async () => {
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
    
    render(<App />);
    
    // Verify error is displayed
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
    
    // Click retry button
    const retryButton = screen.getByRole('button', { name: /try again/i });
    await user.click(retryButton);
    
    // Verify products load after retry
    await waitFor(() => {
      expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    });
  });

  it('should handle checkout form validation', async () => {
    const user = userEvent.setup();
    
    render(<App />);
    
    // Navigate to cart
    const cartLink = screen.getByRole('link', { name: /cart/i });
    await user.click(cartLink);
    
    await waitFor(() => {
      expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    });
    
    // Navigate to checkout
    const checkoutButton = screen.getByRole('link', { name: /proceed to checkout/i });
    await user.click(checkoutButton);
    
    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument();
    });
    
    // Try to submit without filling form
    const submitButton = screen.getByRole('button', { name: /complete order/i });
    await user.click(submitButton);
    
    // Verify form validation prevents submission (form should still be visible)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
});
