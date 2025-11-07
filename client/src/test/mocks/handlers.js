import { http, HttpResponse } from 'msw';

const mockProducts = [
  {
    _id: '1',
    name: 'Wireless Headphones',
    price: 2499,
    image: 'https://via.placeholder.com/300',
    stock: 15
  },
  {
    _id: '2',
    name: 'Smart Watch',
    price: 3999,
    image: 'https://via.placeholder.com/300',
    stock: 10
  }
];

let mockCartItems = [
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
];

// Helper to reset cart state between tests
export const resetMockCart = () => {
  mockCartItems = [
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
  ];
};

export const handlers = [
  // Get products
  http.get('http://localhost:5000/api/products', () => {
    return HttpResponse.json({
      success: true,
      data: mockProducts
    });
  }),

  // Add to cart
  http.post('http://localhost:5000/api/cart', async ({ request }) => {
    const body = await request.json();
    const product = mockProducts.find(p => p._id === body.productId);
    const newItem = {
      _id: `cart${Date.now()}`,
      productId: product,
      qty: body.qty || 1,
      userId: 'mock_user_1'
    };
    mockCartItems.push(newItem);
    return HttpResponse.json({
      success: true,
      data: newItem
    }, { status: 201 });
  }),

  // Get cart
  http.get('http://localhost:5000/api/cart', () => {
    const total = mockCartItems.reduce((sum, item) => {
      return sum + (item.productId.price * item.qty);
    }, 0);
    return HttpResponse.json({
      success: true,
      data: {
        items: mockCartItems,
        total
      }
    });
  }),

  // Remove from cart
  http.delete('http://localhost:5000/api/cart/:id', ({ params }) => {
    const { id } = params;
    mockCartItems = mockCartItems.filter(item => item._id !== id);
    return HttpResponse.json({
      success: true,
      message: 'Item removed from cart'
    });
  }),

  // Checkout
  http.post('http://localhost:5000/api/checkout', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      receipt: {
        total: 4998,
        timestamp: new Date().toISOString(),
        items: body.cartItems,
        customerInfo: body.customerInfo
      }
    });
  })
];
