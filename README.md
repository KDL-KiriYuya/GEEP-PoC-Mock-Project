# E-Commerce Mock Site

A simple e-commerce site built with a monorepo structure using Next.js (frontend), FastAPI (backend), and PostgreSQL (database). This project is designed for practicing spec-driven development with intentional bugs and feature enhancement opportunities.

## Features

- 🔐 User authentication with JWT (login, register, logout)
- 👤 User profile management (update email, username, full name)
- 🔑 Password change functionality
- 📜 Order history with detailed view
- 🛍️ Product browsing with pagination
- 🛒 Shopping cart management (client-side state)
- 📦 Order processing with stock validation
- 💳 Dummy payment integration
- 🐳 Docker Compose setup for easy deployment
- 🔄 Next.js Server Actions for API communication
- 🎨 shadcn/ui components with Tailwind CSS
- 🕐 Timezone support (Phnom Penh) with dayjs
- 📝 Code formatting with Prettier (frontend) and Black/Ruff (backend)
- 🔍 Type safety with TypeScript (frontend) and mypy (backend)

## Project Structure

```
ec-mock/
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js App Router pages
│   │   ├── products/ # Product list and detail pages
│   │   ├── cart/     # Shopping cart page
│   │   ├── checkout/ # Checkout page
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/   # React components
│   │   ├── Header.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CartItem.tsx
│   │   └── LayoutWrapper.tsx
│   ├── lib/          # Utility functions and Server Actions
│   │   ├── actions.ts    # Server Actions for API calls
│   │   ├── types.ts      # TypeScript type definitions
│   │   └── cartReducer.ts
│   ├── hooks/        # Custom React hooks
│   │   └── useCart.ts
│   └── package.json
├── backend/          # FastAPI backend application
│   ├── app/
│   │   ├── api/      # API route handlers
│   │   │   ├── products.py
│   │   │   ├── orders.py
│   │   │   └── payments.py
│   │   ├── models/   # SQLAlchemy models
│   │   │   ├── product.py
│   │   │   ├── order.py
│   │   │   └── order_item.py
│   │   ├── schemas/  # Pydantic schemas
│   │   │   ├── product.py
│   │   │   └── order.py
│   │   ├── db/       # Database configuration
│   │   │   ├── base.py
│   │   │   └── session.py
│   │   ├── services/ # Business logic
│   │   │   ├── product_service.py
│   │   │   ├── order_service.py
│   │   │   └── payment_service.py
│   │   └── main.py   # FastAPI app entry point
│   └── requirements.txt
└── infra/            # Infrastructure configuration
    ├── docker-compose.yml
    ├── backend/
    │   └── Dockerfile
    └── db/
        └── init.sql  # Database initialization script
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** (20.10+) and **Docker Compose** (2.0+)
- **Node.js** (18+) and **npm** (9+)
- **Python** 3.11+ (optional, for local backend development without Docker)

## Quick Start

Follow these steps to get the application running locally:

### 1. Clone and Navigate to Project

```bash
cd ec-mock-site  # or your project directory name
```

### 2. Start Backend Services (Database + API)

Navigate to the `infra` directory and start the Docker Compose services:

```bash
cd infra
docker-compose up -d
```

This command will:
- Pull the PostgreSQL 15 image (if not already available)
- Build the FastAPI backend Docker image
- Start a PostgreSQL database container on port **5432**
- Run the database initialization script (`init.sql`) to create tables and seed sample data
- Start the FastAPI backend container on port **8000**

**Verify the services are running:**

```bash
docker-compose ps
```

You should see both `ec-mock-db` and `ec-mock-backend` containers running.

**View logs:**

```bash
# View all logs
docker-compose logs -f

# View backend logs only
docker-compose logs -f backend

# View database logs only
docker-compose logs -f db
```

**Test the backend API:**

```bash
curl http://localhost:8000/api/products
```

### 3. Start Frontend Development Server

Open a new terminal window, navigate to the `frontend` directory, and install dependencies:

```bash
cd frontend
npm install
```

Start the Next.js development server:

```bash
npm run dev
```

The frontend will be available at **http://localhost:3000**

### 4. Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs (Swagger UI)

## Stopping the Application

### Stop Frontend

Press `Ctrl+C` in the terminal running the frontend dev server.

### Stop Backend Services

```bash
cd infra
docker-compose down
```

### Reset Database (Remove All Data)

To stop services and remove all data (including database volumes):

```bash
cd infra
docker-compose down -v
```

The next time you run `docker-compose up`, the database will be reinitialized with fresh sample data.

## API Endpoints

The backend API is available at `http://localhost:8000`. You can also access the interactive API documentation at `http://localhost:8000/docs`.

### Products API

#### Get Products List

```http
GET /api/products?page=1&page_size=20
```

**Query Parameters:**
- `page` (integer, optional): Page number (default: 1)
- `page_size` (integer, optional): Items per page (default: 20)
- `q` (string, optional): Search query (future enhancement)

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "High-performance laptop",
      "price": 120000,
      "stock": 10,
      "image_url": "https://via.placeholder.com/300",
      "category": "Electronics",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "page_size": 20
}
```

#### Get Single Product

```http
GET /api/products/{product_id}
```

**Path Parameters:**
- `product_id` (integer): Product ID

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 120000,
  "stock": 10,
  "image_url": "https://via.placeholder.com/300",
  "category": "Electronics",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Response (404 Not Found):**
```json
{
  "detail": "Product not found"
}
```

### Authentication API

#### Register

```http
POST /api/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword",
  "full_name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "full_name": "John Doe",
  "is_active": true,
  "is_superuser": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepassword"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Demo Credentials:**
- Username: `demo-user` or `admin`
- Password: `password123`

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "full_name": "John Doe",
  "is_active": true,
  "is_superuser": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Update Profile

```http
PUT /api/auth/profile
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "username": "newusername",
  "full_name": "New Name"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "newemail@example.com",
  "username": "newusername",
  "full_name": "New Name",
  "is_active": true,
  "is_superuser": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Change Password

```http
POST /api/auth/change-password
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

#### Logout

```http
POST /api/auth/logout
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "message": "Successfully logged out"
}
```

**Note:** Logout is client-side. The client should discard the access token.

### Orders API

#### Get Order History

```http
GET /api/orders/history
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
[
  {
    "id": 123,
    "user_id": "demo-user",
    "total_amount": 248000,
    "status": "paid",
    "created_at": "2024-01-01T00:00:00Z",
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "quantity": 2,
        "unit_price": 120000
      }
    ]
  }
]
```

#### Create Order

```http
POST /api/orders
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": "demo-user",
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 3,
      "quantity": 1
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "id": 123,
  "user_id": "demo-user",
  "total_amount": 248000,
  "status": "paid",
  "created_at": "2024-01-01T00:00:00Z",
  "items": [
    {
      "id": 1,
      "product_id": 1,
      "quantity": 2,
      "unit_price": 120000
    }
  ]
}
```

**Response (400 Bad Request):**
```json
{
  "detail": "Insufficient stock for product ID 1"
}
```

### Payments API

#### Process Payment (Dummy)

```http
POST /api/payments/checkout
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 2000
}
```

**Response (200 OK):**
```json
{
  "status": "authorized",
  "transaction_id": "dummy-550e8400-e29b-41d4-a716-446655440000"
}
```

**Note:** This is a dummy implementation that always returns success. No actual payment processing occurs.

## Database Schema

### users

- id (SERIAL PRIMARY KEY)
- email (VARCHAR, UNIQUE)
- username (VARCHAR, UNIQUE)
- hashed_password (VARCHAR)
- full_name (VARCHAR, NULLABLE)
- is_active (BOOLEAN, DEFAULT TRUE)
- is_superuser (BOOLEAN, DEFAULT FALSE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### products
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- description (TEXT)
- price (INTEGER) - stored in cents
- stock (INTEGER)
- image_url (VARCHAR)
- category (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### orders
- id (SERIAL PRIMARY KEY)
- user_id (VARCHAR)
- total_amount (INTEGER)
- status (VARCHAR)
- created_at (TIMESTAMP)

### order_items
- id (SERIAL PRIMARY KEY)
- order_id (INTEGER, FK to orders)
- product_id (INTEGER, FK to products)
- quantity (INTEGER)
- unit_price (INTEGER)

## Development

### Backend Development

#### Running Backend Locally (Without Docker)

If you prefer to run the backend outside of Docker:

1. Ensure PostgreSQL is running (you can still use Docker for just the database):
   ```bash
   cd infra
   docker-compose up -d db
   ```

2. Install Python dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Set environment variables:
   ```bash
   export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ec_mock"
   export CORS_ORIGINS="http://localhost:3000"
   ```

4. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

#### Code Quality Tools

The backend uses ruff, black, and mypy for code quality and type safety.

**Install development dependencies:**

```bash
cd backend
pip install -r requirements-dev.txt
```

**Format code:**

```bash
# Using the provided script
./scripts/format.sh

# Or manually
ruff check --fix app/
black app/
```

**Run linting and type checking:**

```bash
# Using the provided script
./scripts/lint.sh

# Or manually
ruff check app/
black --check app/
mypy app/
```

**Using Docker:**

```bash
# Format code in Docker container
docker exec -it ec-mock-backend bash -c "pip install -r requirements-dev.txt && ruff check --fix app/ && black app/"

# Run linting
docker exec -it ec-mock-backend bash -c "pip install -r requirements-dev.txt && ruff check app/ && black --check app/ && mypy app/"
```

#### Backend Dependencies

The backend uses:
- **FastAPI** - Modern web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation using Python type annotations
- **psycopg2-binary** - PostgreSQL adapter
- **uvicorn** - ASGI server

### Frontend Development

The frontend uses Next.js 14 with App Router and Server Actions for simplified data fetching.

#### Environment Variables

Create or verify the `.env.local` file in the `frontend` directory:

```env
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Frontend Dependencies

Key dependencies:
- **Next.js 14+** - React framework with App Router
- **React 18+** - UI library
- **TypeScript** - Type safety

#### Building for Production

```bash
cd frontend
npm run build
npm start
```

### Database Access

#### Connect to PostgreSQL via CLI

```bash
docker exec -it ec-mock-db psql -U postgres -d ec_mock
```

#### Useful SQL Commands

```sql
-- List all tables
\dt

-- View products
SELECT * FROM products LIMIT 10;

-- View orders
SELECT * FROM orders;

-- View order items with product details
SELECT oi.*, p.name, p.price 
FROM order_items oi 
JOIN products p ON oi.product_id = p.id;

-- Check stock levels
SELECT id, name, stock FROM products WHERE stock < 10;

-- Exit psql
\q
```

#### Reset Database

To reset the database with fresh sample data:

```bash
cd infra
docker-compose down -v
docker-compose up -d
```

### Code Structure

#### Frontend Architecture

- **Server Actions** (`lib/actions.ts`): Server-side functions for API communication
- **Client Components**: Interactive components with state management
- **Server Components**: Default components that render on the server
- **Cart State**: Managed with `useReducer` hook in `useCart.ts`

#### Backend Architecture

- **API Routes** (`app/api/`): FastAPI route handlers
- **Services** (`app/services/`): Business logic layer
- **Models** (`app/models/`): SQLAlchemy ORM models
- **Schemas** (`app/schemas/`): Pydantic validation schemas
- **Database** (`app/db/`): Database connection and session management

## Troubleshooting

### Docker Issues

**Problem:** Port already in use
```
Error: bind: address already in use
```

**Solution:** Check if another service is using the port and stop it:
```bash
# Check what's using port 8000
lsof -i :8000

# Check what's using port 5432
lsof -i :5432

# Stop the conflicting service or change ports in docker-compose.yml
```

**Problem:** Docker containers won't start

**Solution:** Check Docker logs and ensure Docker daemon is running:
```bash
docker-compose logs
docker ps -a
```

### Frontend Issues

**Problem:** Cannot connect to backend API

**Solution:** 
1. Verify backend is running: `curl http://localhost:8000/api/products`
2. Check `.env.local` has correct `BACKEND_URL=http://localhost:8000`
3. Restart the frontend dev server

**Problem:** Module not found errors

**Solution:** Reinstall dependencies:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Backend Issues

**Problem:** Database connection errors

**Solution:**
1. Ensure database container is running: `docker-compose ps`
2. Check database logs: `docker-compose logs db`
3. Verify connection string in environment variables

**Problem:** Import errors in Python

**Solution:** Reinstall Python dependencies:
```bash
cd backend
pip install -r requirements.txt
```

### Database Issues

**Problem:** Tables not created or no sample data

**Solution:** Recreate the database:
```bash
cd infra
docker-compose down -v
docker-compose up -d
```

## Known Issues

This project intentionally includes bugs for practice and learning:

### Frontend Bugs

- **BUG-FE-001:** Cart badge doesn't update on first item addition
  - The cart item count in the header doesn't update when adding the first item
  
- **BUG-FE-002:** Cart quantity input allows zero or negative values
  - Users can enter invalid quantities in the cart page
  
- **BUG-FE-003:** Hydration error due to inconsistent SSR/CSR rendering
  - Console shows hydration mismatch warnings on product list page

### Backend Bugs

- **BUG-BE-001:** Orders succeed even when stock is zero
  - Stock validation is not properly implemented in order creation
  
- **BUG-BE-002:** Pagination offset calculation is incorrect
  - Product list pagination returns wrong items (off by one page)

## Future Enhancements

Planned features for future development:

- **FT-001:** Product search functionality
- **FT-002:** Category filtering
- **FT-003:** Cart quantity adjustment and item removal
- **FT-004:** Order history page
- **FT-005:** Mobile responsive design

## Testing

### Manual Testing

1. **Product Browsing:**
   - Visit http://localhost:3000
   - Navigate to Products page
   - Click on a product to view details
   - Test pagination controls

2. **Cart Management:**
   - Add products to cart
   - View cart page
   - Verify cart badge updates
   - Check total calculation

3. **Order Placement:**
   - Proceed to checkout
   - Place an order
   - Verify success message
   - Check database for order record

### API Testing

Use curl or tools like Postman to test API endpoints:

```bash
# Get products
curl http://localhost:8000/api/products

# Get single product
curl http://localhost:8000/api/products/1

# Create order
curl -X POST http://localhost:8000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "demo-user",
    "items": [{"product_id": 1, "quantity": 2}]
  }'
```

## Contributing

This is a practice project. Feel free to:
1. Fix the intentional bugs
2. Implement the future enhancements
3. Add new features
4. Improve the documentation

## License

This is a practice project for learning purposes.
