import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartItem from '../CartItem';

describe('CartItem', () => {
  const mockItem = {
    _id: 'cart1',
    productId: {
      _id: '1',
      name: 'Wireless Headphones',
      price: 2499,
      image: 'https://via.placeholder.com/300'
    },
    qty: 2
  };

  const mockOnUpdateQuantity = vi.fn();
  const mockOnRemove = vi.fn();

  it('should render cart item information correctly', () => {
    render(
      <CartItem
        item={mockItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );
    
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('$24.99 each')).toBeInTheDocument();
    expect(screen.getByAltText('Wireless Headphones')).toHaveAttribute('src', mockItem.productId.image);
  });

  it('should display correct quantity in input', () => {
    render(
      <CartItem
        item={mockItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );
    
    const quantityInput = screen.getByRole('spinbutton', { name: /quantity/i });
    expect(quantityInput).toHaveValue(2);
  });

  it('should calculate and display subtotal correctly', () => {
    render(
      <CartItem
        item={mockItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );
    
    expect(screen.getByText('$49.98')).toBeInTheDocument();
  });

  it('should call onUpdateQuantity when increment button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CartItem
        item={mockItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );
    
    const incrementButton = screen.getByRole('button', { name: /increase quantity/i });
    await user.click(incrementButton);
    
    expect(mockOnUpdateQuantity).toHaveBeenCalledWith('cart1', 3);
  });

  it('should call onUpdateQuantity when decrement button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CartItem
        item={mockItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );
    
    const decrementButton = screen.getByRole('button', { name: /decrease quantity/i });
    await user.click(decrementButton);
    
    expect(mockOnUpdateQuantity).toHaveBeenCalledWith('cart1', 1);
  });

  it('should not decrement below 1', async () => {
    const user = userEvent.setup();
    const itemWithQty1 = { ...mockItem, qty: 1 };
    
    render(
      <CartItem
        item={itemWithQty1}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );
    
    const decrementButton = screen.getByRole('button', { name: /decrease quantity/i });
    expect(decrementButton).toBeDisabled();
  });

  it('should call onUpdateQuantity when quantity input is changed', async () => {
    const user = userEvent.setup();
    render(
      <CartItem
        item={mockItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );
    
    const quantityInput = screen.getByRole('spinbutton', { name: /quantity/i });
    await user.clear(quantityInput);
    await user.type(quantityInput, '3');
    
    // The function should have been called when the input changes
    expect(mockOnUpdateQuantity).toHaveBeenCalled();
    // Verify the cart item ID is correct in the calls
    expect(mockOnUpdateQuantity.mock.calls[0][0]).toBe('cart1');
  });

  it('should call onRemove when remove button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CartItem
        item={mockItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );
    
    const removeButton = screen.getByRole('button', { name: /remove item from cart/i });
    await user.click(removeButton);
    
    expect(mockOnRemove).toHaveBeenCalledWith('cart1');
  });

  it('should disable decrement button when quantity is 1', () => {
    const itemWithQty1 = { ...mockItem, qty: 1 };
    
    render(
      <CartItem
        item={itemWithQty1}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );
    
    const decrementButton = screen.getByRole('button', { name: /decrease quantity/i });
    expect(decrementButton).toBeDisabled();
  });

  it('should update subtotal when quantity changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <CartItem
        item={mockItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );
    
    expect(screen.getByText('$49.98')).toBeInTheDocument();
    
    const incrementButton = screen.getByRole('button', { name: /increase quantity/i });
    await user.click(incrementButton);
    
    // Rerender with updated quantity
    const updatedItem = { ...mockItem, qty: 3 };
    rerender(
      <CartItem
        item={updatedItem}
        onUpdateQuantity={mockOnUpdateQuantity}
        onRemove={mockOnRemove}
      />
    );
    
    expect(screen.getByText('$74.97')).toBeInTheDocument();
  });
});
