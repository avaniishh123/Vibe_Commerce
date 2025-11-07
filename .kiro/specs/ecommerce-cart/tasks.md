# Implementation Plan

- [x] 1. Initialize project structure and dependencies





  - Create root directory with client and server folders
  - Initialize package.json files for root, client, and server
  - Install backend dependencies: express, mongoose, cors, dotenv
  - Install frontend dependencies: react, react-router-dom, axios, tailwindcss
  - Configure TailwindCSS in the client project
  - Set up concurrently script in root package.json for running both servers
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 7.1_

- [x] 2. Set up MongoDB connection and database models





  - Create server/config/db.js with MongoDB Atlas connection logic
  - Create .env file with MONGODB_URI and PORT variables
  - Create server/models/Product.js with Mongoose schema (name, price, image, stock)
  - Create server/models/Cart.js with Mongoose schema (productId, qty, userId) and compound index
  - Create server/models/User.js with Mongoose schema (name, email)
  - Test database connection by starting the server
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 3. Create backend API routes and controllers




  - [x] 3.1 Set up Express server and middleware


    - Create server/server.js with Express app initialization
    - Configure CORS middleware for cross-origin requests
    - Configure express.json() middleware for parsing JSON
    - Set up error handling middleware in server/middleware/errorHandler.js
    - Connect routes to Express app
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 8.2, 8.3, 8.4_
  
  - [x] 3.2 Implement product endpoints


    - Create server/routes/productRoutes.js with GET /api/products route
    - Create server/controllers/productController.js with getProducts function
    - Implement logic to fetch all products from database
    - Return products array with success response format
    - Add error handling for database failures
    - _Requirements: 6.1, 1.1, 1.2, 1.3, 8.2_
  
  - [x] 3.3 Implement cart endpoints


    - Create server/routes/cartRoutes.js with POST, GET, and DELETE routes
    - Create server/controllers/cartController.js with addToCart, getCart, removeFromCart functions
    - Implement addToCart: validate input, create cart item, return 201 status
    - Implement getCart: fetch cart items with populated product details, calculate total
    - Implement removeFromCart: delete cart item by ID, return success message
    - Add error handling for all cart operations
    - _Requirements: 6.2, 6.3, 6.4, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 4.4, 8.2, 8.3_
  
  - [x] 3.4 Implement checkout endpoint


    - Create server/routes/checkoutRoutes.js with POST /api/checkout route
    - Create server/controllers/checkoutController.js with processCheckout function
    - Implement logic to calculate total from cart items
    - Generate mock receipt with total, timestamp, items, and customer info
    - Return receipt object with success response
    - Add validation for required fields (cartItems, customerInfo)
    - _Requirements: 6.5, 5.2, 5.3, 5.4, 8.3_

- [x] 4. Seed database with initial product data





  - Create server/seed.js script to populate products collection
  - Define 8-10 mock products with name, price, image URL, and stock
  - Create a mock user with name and email in users collection
  - Add script command to package.json for running seed script
  - Run seed script to populate database
  - _Requirements: 7.2, 7.4, 1.2_

- [x] 5. Set up frontend React application structure





  - Create client/src/App.jsx with React Router configuration
  - Set up routes for home (/), cart (/cart), and checkout (/checkout) pages
  - Create client/src/services/api.js with Axios instance
  - Configure base URL for API requests using environment variable
  - Add Axios response interceptor for global error handling
  - Create client/src/index.css with TailwindCSS imports
  - _Requirements: 1.1, 3.1, 5.1, 8.1, 8.5_

- [x] 6. Implement ProductGrid and ProductCard components




  - [x] 6.1 Create ProductCard component


    - Create client/src/components/ProductCard.jsx
    - Accept product prop with _id, name, price, image, stock
    - Display product image, name, and formatted price
    - Add "Add to Cart" button with onClick handler
    - Style with TailwindCSS for responsive card layout
    - _Requirements: 1.3, 1.4, 9.1, 9.2, 9.5_
  
  - [x] 6.2 Create ProductGrid component


    - Create client/src/components/ProductGrid.jsx
    - Add state for products array, loading, and error
    - Implement fetchProducts function using api.js service
    - Call fetchProducts in useEffect on component mount
    - Render ProductCard components in responsive grid (1-4 columns based on screen size)
    - Display loading spinner while fetching
    - Display error message if fetch fails
    - Implement handleAddToCart function to call POST /api/cart endpoint
    - Show success notification when item added to cart
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.5, 8.1, 8.5, 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 7. Implement Cart and CartItem components






  - [x] 7.1 Create CartItem component

    - Create client/src/components/CartItem.jsx
    - Accept item, onUpdateQuantity, and onRemove props
    - Display product thumbnail, name, price, and quantity
    - Add quantity input/stepper controls
    - Calculate and display subtotal (price × quantity)
    - Add remove button with onClick handler
    - Style with TailwindCSS for responsive layout
    - _Requirements: 3.3, 3.4, 4.1, 4.3, 9.1, 9.3, 9.5_
  
  - [x] 7.2 Create Cart component



    - Create client/src/components/Cart.jsx
    - Add state for cartItems, total, and loading
    - Implement fetchCart function using api.js service
    - Call fetchCart in useEffect on component mount
    - Render CartItem components for each item
    - Implement handleUpdateQuantity to send update request (re-fetch cart after update)
    - Implement handleRemoveItem to call DELETE /api/cart/:id endpoint
    - Calculate and display total cost
    - Add "Proceed to Checkout" button linking to /checkout
    - Display "Your cart is empty" message when no items
    - Handle loading and error states
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.2, 4.3, 4.5, 8.1, 8.5, 9.1, 9.2, 9.4, 9.5_

- [x] 8. Implement Checkout component





  - Create client/src/components/Checkout.jsx
  - Add state for formData (name, email), cartItems, receipt, and loading
  - Fetch cart items on component mount to display in checkout summary
  - Create form with name and email input fields
  - Implement handleInputChange to update formData state
  - Implement handleSubmit to call POST /api/checkout endpoint
  - Display mock receipt after successful checkout (total, timestamp, items)
  - Add form validation for required fields
  - Add "Back to Shopping" link to navigate to home
  - Style with TailwindCSS for responsive form layout
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 8.1, 8.5, 9.1, 9.2, 9.4, 9.5_

- [x] 9. Implement API service functions





  - Add getProducts() function to fetch all products
  - Add addToCart(productId, qty) function to add item to cart
  - Add getCart() function to fetch cart items
  - Add removeFromCart(itemId) function to delete cart item
  - Add checkout(cartItems, customerInfo) function to process checkout
  - Ensure all functions return promises and handle errors
  - Use consistent response format handling
  - _Requirements: 1.1, 2.1, 3.1, 4.4, 5.2, 8.1_

- [x] 10. Add responsive styling and polish





  - Ensure all components use TailwindCSS responsive utilities
  - Test layouts on mobile (320px-480px), tablet (768px-1024px), and desktop (1280px+)
  - Add hover states for buttons and interactive elements
  - Ensure touch-friendly button sizes on mobile (min 44px)
  - Add loading spinners for async operations
  - Add success/error toast notifications for user actions
  - Verify text readability and image scaling across screen sizes
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 11. Write backend tests







  - [x] 11.1 Set up testing environment






    - Install Jest and Supertest as dev dependencies
    - Create jest.config.js with test environment configuration
    - Set up test database connection
    - _Requirements: 8.2, 8.3, 8.4_
  
  - [x] 11.2 Write controller unit tests








    - Create tests for productController.getProducts
    - Create tests for cartController (addToCart, getCart, removeFromCart)
    - Create tests for checkoutController.processCheckout
    - Mock Mongoose models to isolate controller logic
    - Test error handling paths
    - _Requirements: 8.2, 8.3, 8.4_
  

  - [x] 11.3 Write API integration tests






    - Test GET /api/products endpoint
    - Test POST /api/cart endpoint with valid and invalid data
    - Test GET /api/cart endpoint
    - Test DELETE /api/cart/:id endpoint
    - Test POST /api/checkout endpoint
    - Verify status codes and response formats
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 8.2, 8.3_

- [x] 12. Write frontend tests





  - [x] 12.1 Set up testing environment








    - Install React Testing Library and Jest
    - Install MSW (Mock Service Worker) for API mocking
    - Configure test setup file
    - _Requirements: 8.1, 8.5_
  
  - [x] 12.2 Write component tests







    - Test ProductCard rendering and interactions
    - Test ProductGrid loading, error, and success states
    - Test CartItem rendering and controls
    - Test Cart component with empty and populated states
    - Test Checkout form validation and submission
    - Mock API calls using MSW
    - _Requirements: 1.1, 1.3, 1.4, 2.5, 3.3, 3.5, 4.1, 4.3, 5.1, 8.1, 8.5_
  
  - [x] 12.3 Write integration tests






    - Test complete user flow: browse → add to cart → checkout
    - Test navigation between pages
    - Test cart persistence across page navigation
    - _Requirements: 1.1, 2.1, 3.1, 5.2, 5.5_
-

- [x] 13. Final integration and testing




  - Run both client and server concurrently using npm run dev
  - Test complete user flow manually: browse products → add to cart → view cart → update quantities → checkout
  - Test error scenarios: network failures, empty states, invalid inputs
  - Verify responsive design on different screen sizes
  - Test CORS configuration between frontend and backend
  - Verify MongoDB data persistence across server restarts
  - _Requirements: 1.1, 1.5, 2.1, 2.5, 3.1, 3.5, 4.1, 4.5, 5.1, 5.5, 8.1, 8.2, 8.5, 9.1, 9.2, 9.3, 9.4_
