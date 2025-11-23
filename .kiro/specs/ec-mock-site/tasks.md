# Implementation Plan

- [x] 1. Set up project structure and infrastructure
  - Create monorepo directory structure (frontend, backend, infra)
  - Create Docker Compose configuration for PostgreSQL and FastAPI backend
  - Create Dockerfile for backend service
  - Create database initialization script (init.sql) with table schemas and sample data
  - _Requirements: 6.1, 6.2, 6.3, 6.5_

- [x] 2. Implement backend database layer
  - [x] 2.1 Create SQLAlchemy base configuration and database session management
    - Implement database connection setup in app/db/session.py
    - Create Base class in app/db/base.py
    - _Requirements: 4.4_
  - [x] 2.2 Implement SQLAlchemy models for Product, Order, and OrderItem
    - Create Product model with all fields and relationships
    - Create Order model with relationship to OrderItem
    - Create OrderItem model with foreign key relationships
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 3. Implement backend Pydantic schemas
  - [x] 3.1 Create product schemas
    - Implement ProductBase, ProductResponse, and ProductListResponse schemas
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 3.2 Create order schemas
    - Implement OrderItemCreate, OrderCreate, OrderItemResponse, and OrderResponse schemas
    - _Requirements: 5.4, 5.5_

- [x] 4. Implement backend service layer
  - [x] 4.1 Create ProductService
    - Implement get_products method with pagination (intentionally include BUG-BE-002: incorrect offset calculation)
    - Implement get_product_by_id method with error handling
    - Implement check_stock method
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 4.2 Create PaymentService with dummy payment processing
    - Implement process_payment method that always returns success with dummy transaction ID
    - _Requirements: 5.6, 5.7_
  - [x] 4.3 Create OrderService
    - Implement validate_order_items method (intentionally omit stock check for BUG-BE-001)
    - Implement create_order method with transaction handling
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 4.5, 5.4, 5.5_

- [x] 5. Implement backend API endpoints
  - [x] 5.1 Create FastAPI application setup
    - Initialize FastAPI app in main.py
    - Configure CORS middleware
    - Set up error handling with standard JSON error format
    - _Requirements: 5.8, 5.9_
  - [x] 5.2 Implement products API endpoints
    - Create GET /api/products endpoint with pagination parameters
    - Create GET /api/products/{product_id} endpoint with 404 handling
    - _Requirements: 5.1, 5.2, 5.3_
  - [x] 5.3 Implement payments API endpoint
    - Create POST /api/payments/checkout endpoint
    - _Requirements: 5.6, 5.7_
  - [x] 5.4 Implement orders API endpoint
    - Create POST /api/orders endpoint with validation and error responses
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 5.4, 5.5_

- [x] 6. Set up frontend Next.js project
  - [x] 6.1 Initialize Next.js project with TypeScript
    - Create Next.js app with App Router
    - Configure TypeScript and next.config.js
    - Set up environment variables for backend API URL
    - _Requirements: 6.4_
  - [x] 6.2 Create TypeScript type definitions
    - Define Product, CartItem, Order, and OrderCreateRequest interfaces in lib/types.ts
    - _Requirements: 1.1, 2.1, 3.1_

- [x] 7. Implement frontend Server Actions
  - Create lib/actions.ts with server-side API calls
  - Implement getProducts Server Action
  - Implement getProduct Server Action
  - Implement createOrder Server Action with error handling
  - _Requirements: 1.2, 3.2, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 8. Implement cart state management
  - [x] 8.1 Create cart reducer and types
    - Define CartState and CartAction types
    - Implement cartReducer with ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, and CLEAR_CART actions
    - _Requirements: 2.1, 2.2_
  - [x] 8.2 Create useCart hook (intentionally include BUG-FE-001: cart badge not updating on first add)
    - Implement useCart hook with cart state and action methods
    - Use incorrect state reference pattern that causes first update to fail
    - _Requirements: 2.1, 2.2_

- [x] 9. Implement frontend layout and navigation
  - [x] 9.1 Create root layout
    - Implement app/layout.tsx with HTML structure and metadata
    - _Requirements: 1.1_
  - [x] 9.2 Create Header component
    - Implement Header with navigation links and cart badge
    - Display cart item count from cart state
    - _Requirements: 2.2_

- [x] 10. Implement product browsing pages
  - [x] 10.1 Create product list page (intentionally include BUG-FE-003: hydration error)
    - Implement app/products/page.tsx
    - Fetch products using getProducts Server Action
    - Use Math.random() for keys to cause hydration mismatch
    - Render product grid with pagination controls
    - _Requirements: 1.1, 1.2, 1.3_
  - [x] 10.2 Create ProductCard component
    - Implement ProductCard with product display and action buttons
    - Add "View Details" and "Add to Cart" buttons
    - _Requirements: 1.3_
  - [x] 10.3 Create product detail page
    - Implement app/products/[id]/page.tsx
    - Fetch single product using getProduct Server Action
    - Display detailed product information
    - Add "Add to Cart" button
    - _Requirements: 1.4, 1.5_

- [ ] 11. Implement cart page
  - [x] 11.1 Create CartItem component (intentionally include BUG-FE-002: allow zero/negative quantities)
    - Implement CartItem with product details display
    - Add quantity input without validation
    - Display subtotal calculation
    - _Requirements: 2.3, 2.4_
  - [x] 11.2 Create cart page
    - Implement app/cart/page.tsx
    - Display all cart items using CartItem component
    - Calculate and display total amount
    - Add "Proceed to Checkout" button
    - _Requirements: 2.3, 2.4, 2.5, 2.6_

- [x] 12. Implement checkout page
  - Create app/checkout/page.tsx
  - Display order summary (read-only)
  - Implement "Place Order" button with createOrder Server Action
  - Handle success and error responses
  - Clear cart on successful order
  - Display success/error messages to user
  - _Requirements: 3.1, 3.2, 3.7_

- [x] 13. Create backend requirements.txt and setup instructions
  - List all Python dependencies (fastapi, sqlalchemy, psycopg2-binary, pydantic, uvicorn)
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 14. Create frontend package.json dependencies
  - Configure Next.js, React, TypeScript dependencies
  - _Requirements: 6.1, 6.4_

- [x] 15. Create README with setup and run instructions
  - Document how to start Docker Compose services
  - Document how to run frontend development server
  - Document API endpoints and project structure
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
