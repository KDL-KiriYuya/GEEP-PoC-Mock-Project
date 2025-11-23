-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Insert sample users (password: "password123" for all)
INSERT INTO users (email, username, hashed_password, full_name, is_superuser) VALUES
('admin@example.com', 'admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqVqN4e6.u', 'Admin User', TRUE),
('user@example.com', 'demo-user', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqVqN4e6.u', 'Demo User', FALSE);

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image_url VARCHAR(512),
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
);

-- Create indexes for products table
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_name ON products(name);

-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    total_amount INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC')
);

-- Create indexes for orders table
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Create order_items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price INTEGER NOT NULL
);

-- Create index for order_items table
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Insert sample products (300 items for pagination testing)
DO $$
DECLARE
    i INTEGER;
    categories TEXT[] := ARRAY['Electronics', 'Home', 'Furniture', 'Accessories', 'Stationery', 'Sports', 'Books', 'Toys'];
    products TEXT[] := ARRAY['Laptop', 'Mouse', 'Keyboard', 'Monitor', 'Webcam', 'Headphones', 'Speaker', 'Tablet', 'Phone', 'Watch'];
    adjectives TEXT[] := ARRAY['Pro', 'Ultra', 'Premium', 'Deluxe', 'Advanced', 'Smart', 'Wireless', 'Portable', 'Compact', 'Professional'];
    colors TEXT[] := ARRAY['0066cc', '00cc66', 'cc6600', '9900cc', 'cc0066', '0099cc', '66cc00', 'cc9900', '6600cc', 'cc0099', '00cccc', 'cccc00'];
    product_name TEXT;
    description TEXT;
    price INTEGER;
    stock INTEGER;
    image_url TEXT;
    category TEXT;
    color TEXT;
BEGIN
    FOR i IN 1..300 LOOP
        product_name := products[(i % 10) + 1] || ' ' || adjectives[(i % 10) + 1] || ' ' || i::TEXT;
        description := 'High-quality ' || products[(i % 10) + 1] || ' with advanced features and ' || adjectives[(i % 10) + 1] || ' design';
        price := 1000 + (i * 100) + ((i % 10) * 500);
        stock := 5 + ((i % 20) * 5);
        category := categories[(i % 8) + 1];
        color := colors[(i % 12) + 1];
        image_url := 'https://via.placeholder.com/300/' || color || '/ffffff?text=' || replace(product_name, ' ', '+');
        
        INSERT INTO products (name, description, price, stock, image_url, category)
        VALUES (product_name, description, price, stock, image_url, category);
    END LOOP;
END $$;
