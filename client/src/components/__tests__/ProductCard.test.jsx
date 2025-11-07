import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '../ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    _id: '1',
    name: 'Wireless Headphones',
    price: 2499,
    image: 'https://via.placeholder.com/300',
    stock: 15
  };

  const mockOnAddToCart = vi.fn();

  it('should render product information correctly', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);
    
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('$24.99')).toBeInTheDocument();
    expect(screen.getByAltText('Wireless Headphones')).toHaveAttribute('src', mockProduct.image);
  });

  it('should display "Add to Cart" button when product is in stock', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);
    
    const button = screen.getByRole('button', { name: /add wireless headphones to cart/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Add to Cart');
    expect(button).not.toBeDisabled();
  });

  it('should call onAddToCart with product ID when button is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);
    
    const button = screen.getByRole('button', { name: /add wireless headphones to cart/i });
    await user.click(button);
    
    expect(mockOnAddToCart).toHaveBeenCalledWith('1');
    expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
  });

  it('should display "Out of Stock" when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductCard product={outOfStockProduct} onAddToCart={mockOnAddToCart} />);
    
    expect(screen.getAllByText('Out of Stock')).toHaveLength(2);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should display low stock warning when stock is 10 or less', () => {
    const lowStockProduct = { ...mockProduct, stock: 5 };
    render(<ProductCard product={lowStockProduct} onAddToCart={mockOnAddToCart} />);
    
    expect(screen.getByText('Only 5 left')).toBeInTheDocument();
  });

  it('should not display low stock warning when stock is above 10', () => {
    const highStockProduct = { ...mockProduct, stock: 20 };
    render(<ProductCard product={highStockProduct} onAddToCart={mockOnAddToCart} />);
    
    expect(screen.queryByText(/only.*left/i)).not.toBeInTheDocument();
  });

  it('should format price correctly', () => {
    const productWithDifferentPrice = { ...mockProduct, price: 12345 };
    render(<ProductCard product={productWithDifferentPrice} onAddToCart={mockOnAddToCart} />);
    
    expect(screen.getByText('$123.45')).toBeInTheDocument();
  });
});
