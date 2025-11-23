# Design Document

## Overview

This document describes the detailed design for a simple e-commerce site built with a monorepo architecture. The system consists of three main components:

1. **Frontend**: Next.js application using App Router and Server Actions
2. **Backend**: FastAPI REST API server
3. **Database**: PostgreSQL database

The system implements core e-commerce functionality including product browsing, cart management, and order processing with dummy payment integration. The design prioritizes simplicity and maintainability while providing a foundation for future enhancements.

## Architecture

### System Architecture Diagram

```mermaid
graph TB
    User[User Browser]
    Frontend[Next.js Frontend<br/>Port 3000]
    Backend[FastAPI Backend<br/>Port 8000]
    DB[(PostgreSQL<br/>Port 5432)]
    
    User -->|HTTP| Frontend
    Frontend -->|Server Actions<br/>REST API| Backend
    Backend -->|SQL| DB
    
    subgraph "Docker Compose"
        Backend
        DB
    end
```

### Technology Stack

**Frontend:**
- Next.js 14+ with App Router
- TypeScript
- React Server Components and Server Actions
- Client-side state management with React hooks (useState, useReducer)
- Optional: localStorage for cart persistence

**Backend:**
- Python 3.11+
- FastAPI framework
- SQLAlchemy ORM
- Pydantic for data validation
- uvicorn ASGI server

**Database:**
- PostgreSQL 15+
- Initial data seeding via init.sql

**Infrastructure:**
- Docker and Docker Compose for containerization
- Monorepo structure with separate frontend, backend, and infra directories

### Directory Structure

```
/ec-mock
  /frontend
    /app
      /products
        page.tsx
        /[id]
          page.tsx
      /cart
        page.tsx
      /checkout
        page.tsx
      layout.tsx
      page.tsx
    /components
      Header.tsx
      ProductCard.tsx
      CartItem.tsx
    /lib
      actions.ts        # Server Actions
      types.ts
    /hooks
      useCart.ts
    package.json
    tsconfig.json
    next.config.js
  
  /backend
    /app
      main.py
      /api
        products.py
        orders.py
        payments.py
      /models
        product.py
        order.py
        order_item.py
      /schemas
        product.py
        order.py
      /db
        session.py
        base.py
      /services
        product_service.py
        order_service.py
        payment_service.py
    requirements.txt
    Dockerfile
  
  /infra
    docker-compose.yml
    /backend
      Dockerfile
    /db
      init.sql
```

## Components and Interfaces

### Frontend Components

#### 1. Layout and Navigation

**Header Component**
- Displays site logo/title
- Navigation links (Products, Cart)
- Cart badge showing item count
- Responsive design

**Props:**
```typescript
interface HeaderProps {
  cartItemCount: number;
}
```

#### 2. Product Components

**ProductCard Component**
- Displays product thumbnail, name, and price
- "View Details" button
- "Add to Cart" button

**Props:**
```typescript
interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    image_url: string;
  };
  onAddToCart: (productId: number) => void;
}
```

**ProductList Page**
- Fetches products via Server Action
- Renders grid of ProductCard components
- Implements pagination controls

#### 3. Cart Components

**CartItem Component**
- Displays product details in cart
- Shows quantity and subtotal
- Future: quantity adjustment and remove buttons

**Props:**
```typescript
interface CartItemProps {
  item: {
    product_id: number;
    name: string;
    price: number;
    quantity: number;
  };
}
```

**Cart Page**
- Lists all cart items
- Displays total amount
- "Proceed to Checkout" button

#### 4. Checkout Components

**Checkout Page**
- Displays order summary (read-only)
- "Place Order" button
- Handles order submission via Server Action
- Shows success/error messages

### Backend API Endpoints

#### Products API

**GET /api/products**
```python
Query Parameters:
  - page: int = 1
  - page_size: int = 20
  - q: Optional[str] = None  # Search query (future enhancement)

Response: 200 OK
{
  "items": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Product description",
      "price": 1000,
      "stock": 50,
      "image_url": "https://example.com/image.jpg",
      "category": "Electronics"
    }
  ],
  "total": 100,
  "page": 1,
  "page_size": 20
}
```

**GET /api/products/{product_id}**
```python
Path Parameters:
  - product_id: int

Response: 200 OK
{
  "id": 1,
  "name": "Product Name",
  "description": "Detailed description",
  "price": 1000,
  "stock": 50,
  "image_url": "https://example.com/image.jpg",
  "category": "Electronics",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}

Response: 404 Not Found
{
  "detail": "Product not found"
}
```

#### Orders API

**POST /api/orders**
```python
Request Body:
{
  "user_id": "demo-user",
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ]
}

Response: 200 OK
{
  "order_id": 123,
  "status": "paid",
  "total_amount": 2000,
  "created_at": "2024-01-01T00:00:00Z"
}

Response: 400 Bad Request
{
  "detail": "Insufficient stock for product ID 1"
}
```

**GET /api/orders** (Future enhancement)
```python
Query Parameters:
  - user_id: str

Response: 200 OK
{
  "orders": [
    {
      "id": 123,
      "total_amount": 2000,
      "status": "paid",
      "created_at": "2024-01-01T00:00:00Z",
      "items": [...]
    }
  ]
}
```

#### Payments API

**POST /api/payments/checkout**
```python
Request Body:
{
  "amount": 2000
}

Response: 200 OK
{
  "status": "authorized",
  "transaction_id": "dummy-550e8400-e29b-41d4-a716-446655440000"
}
```

### Backend Services

#### ProductService
- `get_products(page, page_size, search_query)`: Retrieve paginated products
- `get_product_by_id(product_id)`: Retrieve single product
- `check_stock(product_id, quantity)`: Verify stock availability

#### OrderService
- `create_order(user_id, items)`: Create new order with validation
- `get_orders_by_user(user_id)`: Retrieve user's order history
- `validate_order_items(items)`: Validate items and check stock

#### PaymentService
- `process_payment(amount)`: Call dummy payment API
- Returns mock authorization response

## Data Models

### Database Schema

#### products Table
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image_url VARCHAR(512),
    category VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_name ON products(name);
```

#### orders Table
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    total_amount INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

#### order_items Table
```sql
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price INTEGER NOT NULL
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

### SQLAlchemy Models

**Product Model**
```python
class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(Integer, nullable=False)
    stock = Column(Integer, nullable=False, default=0)
    image_url = Column(String(512))
    category = Column(String(100))
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
```

**Order Model**
```python
class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), nullable=False)
    total_amount = Column(Integer, nullable=False)
    status = Column(String(50), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
```

**OrderItem Model**
```python
class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Integer, nullable=False)
    
    order = relationship("Order", back_populates="items")
    product = relationship("Product")
```

### Pydantic Schemas

**Product Schemas**
```python
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: int
    stock: int
    image_url: Optional[str] = None
    category: Optional[str] = None

class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    page_size: int
```

**Order Schemas**
```python
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    user_id: str
    items: List[OrderItemCreate]

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: int
    
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    user_id: str
    total_amount: int
    status: str
    created_at: datetime
    items: List[OrderItemResponse]
    
    class Config:
        from_attributes = True
```

### Frontend Types

```typescript
// lib/types.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category: string;
}

export interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface Order {
  id: number;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface OrderCreateRequest {
  user_id: string;
  items: {
    product_id: number;
    quantity: number;
  }[];
}
```

## State Management

### Cart State Management

The cart will be managed on the client side using React hooks. The state structure:

```typescript
interface CartState {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { product_id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { product_id: number; quantity: number } }
  | { type: 'CLEAR_CART' };
```

**useCart Hook**
```typescript
export function useCart() {
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);
  
  const addToCart = (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };
  
  const removeFromCart = (product_id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { product_id } });
  };
  
  const updateQuantity = (product_id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { product_id, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  return { cart, addToCart, removeFromCart, updateQuantity, clearCart };
}
```

### Server Actions

Server Actions will be used to communicate with the backend API:

```typescript
// lib/actions.ts
'use server'

export async function getProducts(page: number = 1, pageSize: number = 20) {
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/products?page=${page}&page_size=${pageSize}`
  );
  return response.json();
}

export async function getProduct(id: number) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/products/${id}`);
  return response.json();
}

export async function createOrder(orderData: OrderCreateRequest) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  return response.json();
}
```

## Error Handling

### Backend Error Handling

**Standard Error Response Format:**
```python
{
  "detail": "Error message describing what went wrong"
}
```

**HTTP Status Codes:**
- 200: Success
- 400: Bad Request (validation errors, insufficient stock)
- 404: Not Found (product or order not found)
- 500: Internal Server Error

**FastAPI Exception Handlers:**
```python
from fastapi import HTTPException

# Stock validation
if product.stock < quantity:
    raise HTTPException(
        status_code=400,
        detail=f"Insufficient stock for product ID {product_id}"
    )

# Product not found
if not product:
    raise HTTPException(
        status_code=404,
        detail=f"Product with ID {product_id} not found"
    )
```

### Frontend Error Handling

**Server Action Error Handling:**
```typescript
try {
  const result = await createOrder(orderData);
  if (result.error) {
    // Display error message to user
    setError(result.error);
  } else {
    // Success - redirect to confirmation page
    router.push(`/orders/${result.order_id}`);
  }
} catch (error) {
  setError('An unexpected error occurred. Please try again.');
}
```

**User-Facing Error Messages:**
- Network errors: "Unable to connect to server. Please check your connection."
- Validation errors: Display specific field errors
- Stock errors: "Sorry, this product is out of stock."
- Generic errors: "Something went wrong. Please try again."

## Testing Strategy

### Backend Testing

**Unit Tests:**
- Test individual service methods (ProductService, OrderService, PaymentService)
- Test data validation with Pydantic schemas
- Test database model relationships

**Integration Tests:**
- Test API endpoints with test database
- Test order creation flow end-to-end
- Test stock validation logic

**Test Framework:** pytest with pytest-asyncio

**Example Test Structure:**
```python
# tests/test_orders.py
def test_create_order_success(test_db, sample_products):
    """Test successful order creation with valid data"""
    pass

def test_create_order_insufficient_stock(test_db, sample_products):
    """Test order creation fails when stock is insufficient"""
    pass
```

### Frontend Testing

**Component Tests:**
- Test ProductCard rendering and interactions
- Test CartItem component
- Test Header cart badge updates

**Integration Tests:**
- Test cart add/remove functionality
- Test checkout flow
- Test Server Actions

**Test Framework:** Jest and React Testing Library

**Example Test Structure:**
```typescript
// __tests__/components/ProductCard.test.tsx
describe('ProductCard', () => {
  it('renders product information correctly', () => {
    // Test implementation
  });
  
  it('calls onAddToCart when button is clicked', () => {
    // Test implementation
  });
});
```

### Manual Testing Scenarios

1. **Product Browsing:**
   - Navigate to product list
   - Click product details
   - Verify pagination works

2. **Cart Management:**
   - Add products to cart
   - Verify cart badge updates
   - View cart page

3. **Order Placement:**
   - Proceed to checkout
   - Place order
   - Verify order success message

4. **Error Scenarios:**
   - Attempt to order out-of-stock product
   - Test with invalid data
   - Test network error handling

## Known Issues and Future Enhancements

### Intentional Bugs (To be fixed as tasks)

**Frontend Bugs:**
1. BUG-FE-001: Cart badge doesn't update on first item addition
2. BUG-FE-002: Cart quantity input allows zero or negative values
3. BUG-FE-003: Hydration error due to inconsistent SSR/CSR rendering

**Backend Bugs:**
1. BUG-BE-001: Orders succeed even when stock is zero
2. BUG-BE-002: Pagination offset calculation is incorrect (off by one page)

### Future Feature Enhancements

1. FT-001: Product search functionality
2. FT-002: Category filtering
3. FT-003: Cart quantity adjustment and item removal
4. FT-004: Order history page
5. FT-005: Mobile responsive design

## Deployment Considerations

### Docker Compose Configuration

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: ec_mock
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: ../backend
      dockerfile: ../infra/backend/Dockerfile
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/ec_mock
    depends_on:
      - db
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

volumes:
  postgres_data:
```

### Environment Variables

**Backend (.env):**
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ec_mock
CORS_ORIGINS=http://localhost:3000
```

**Frontend (.env.local):**
```
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Initial Data Seeding

The init.sql script will populate the database with sample products:

```sql
-- Sample products for testing
INSERT INTO products (name, description, price, stock, image_url, category) VALUES
('Laptop', 'High-performance laptop', 120000, 10, 'https://via.placeholder.com/300', 'Electronics'),
('Mouse', 'Wireless mouse', 3000, 50, 'https://via.placeholder.com/300', 'Electronics'),
('Keyboard', 'Mechanical keyboard', 8000, 30, 'https://via.placeholder.com/300', 'Electronics'),
-- Add more sample products...
```

## Design Decisions and Rationale

1. **Monorepo Structure**: Keeps related code together, simplifies dependency management, and makes it easier to share types between frontend and backend.

2. **Server Actions**: Leverages Next.js 14's Server Actions for simplified data fetching and mutations without needing separate API routes in the frontend.

3. **Client-Side Cart State**: Cart state is managed on the client for better UX (instant updates) and reduced server load. Future enhancement could add server-side cart persistence.

4. **Dummy Payment API**: Simplifies development and testing by avoiding external service dependencies and API key management.

5. **Fixed User ID**: Eliminates authentication complexity for this practice project while still maintaining the data structure for future user management.

6. **Integer Prices**: Stores prices as integers (in cents/smallest currency unit) to avoid floating-point precision issues.

7. **Intentional Bugs**: Provides realistic debugging scenarios for practicing issue resolution and testing.
