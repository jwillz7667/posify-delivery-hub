-- Start transaction
BEGIN;

-- Drop existing tables (in correct order to handle dependencies)
DROP TABLE IF EXISTS restocks CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS staff_activity_log CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS authenticate_staff CASCADE;
DROP FUNCTION IF EXISTS get_staff_by_id CASCADE;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Staff Table (POS System Users)
create table staff (
  id uuid primary key default uuid_generate_v4(),
  name varchar(255) not null,
  pincode varchar(4) unique not null,     -- Each staff member has a unique PIN
  role varchar(50) not null check (role in ('ADMIN', 'MANAGER', 'STAFF')),
  is_active boolean default true,
  last_login timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Customers Table (Separate from staff/POS users)
create table customers (
  id uuid primary key default uuid_generate_v4(),
  name varchar(255),
  email varchar(255) unique,
  phone varchar(50),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Product Categories
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name varchar(100) not null,
  description text,
  parent_category_id uuid references categories(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Products
create table products (
  id uuid primary key default uuid_generate_v4(),
  name varchar(255) not null,
  description text,
  sku varchar(100) unique,
  price numeric(10,2) not null,
  cost_price numeric(10,2),
  category_id uuid references categories(id),
  barcode varchar(100),
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Orders
create table orders (
  id uuid primary key default uuid_generate_v4(),
  staff_id uuid references staff(id) not null,    -- Track which staff member created the order
  customer_id uuid references customers(id),       -- Optional customer reference
  total_amount numeric(10,2) not null,
  status varchar(50) not null check (status in ('PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED')),
  payment_method varchar(50) check (payment_method in ('CASH', 'CARD', 'MOBILE')),
  transaction_id varchar(255),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order Items
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) not null,
  product_id uuid references products(id) not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  created_at timestamptz default now()
);

-- Inventory
create table inventory (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) not null,
  current_stock integer not null default 0,
  low_stock_threshold integer default 10,
  last_restocked timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Suppliers
create table suppliers (
  id uuid primary key default uuid_generate_v4(),
  name varchar(255) not null,
  contact_email varchar(255),
  contact_phone varchar(50),
  address jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Inventory Restocks
create table restocks (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) not null,
  supplier_id uuid references suppliers(id),
  quantity integer not null check (quantity > 0),
  unit_cost numeric(10,2) not null,
  restock_date timestamptz default now(),
  received_by uuid references staff(id),           -- Reference staff instead of users
  created_at timestamptz default now()
);

-- Staff Activity Log
create table staff_activity_log (
  id uuid primary key default uuid_generate_v4(),
  staff_id uuid references staff(id) not null,
  action_type varchar(50) not null,
  details jsonb,
  created_at timestamptz default now()
);

-- Indexes for common queries
create index idx_staff_pincode on staff(pincode);
create index idx_orders_staff_id on orders(staff_id);
create index idx_orders_customer_id on orders(customer_id);
create index idx_products_category_id on products(category_id);
create index idx_order_items_order_id on order_items(order_id);
create index idx_inventory_product_id on inventory(product_id);

-- Enable Row Level Security
alter table staff enable row level security;
alter table customers enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table inventory enable row level security;
alter table suppliers enable row level security;
alter table restocks enable row level security;
alter table staff_activity_log enable row level security;

-- Authentication Function
CREATE OR REPLACE FUNCTION authenticate_staff(pincode_input text)
RETURNS json AS $$
DECLARE
    staff_record staff;
    result json;
BEGIN
    -- Get staff record by pincode
    SELECT * INTO staff_record
    FROM staff
    WHERE pincode = pincode_input
    AND is_active = true;

    -- Check if staff exists
    IF staff_record.id IS NOT NULL THEN
        -- Update last login
        UPDATE staff 
        SET last_login = now()
        WHERE id = staff_record.id;

        -- Log the login
        INSERT INTO staff_activity_log (staff_id, action_type, details)
        VALUES (
            staff_record.id,
            'LOGIN',
            json_build_object('name', staff_record.name, 'role', staff_record.role)
        );

        -- Return success with staff data
        SELECT json_build_object(
            'success', true,
            'staff', json_build_object(
                'id', staff_record.id,
                'name', staff_record.name,
                'role', staff_record.role
            )
        ) INTO result;
    ELSE
        -- Return error
        SELECT json_build_object(
            'success', false,
            'message', 'Invalid PIN'
        ) INTO result;
    END IF;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create initial staff members with unique PINs
INSERT INTO staff (name, pincode, role) 
VALUES 
    ('Admin', '1234', 'ADMIN'),      -- Admin PIN: 1234
    ('Manager', '5678', 'MANAGER'),  -- Manager PIN: 5678
    ('Staff 1', '9012', 'STAFF'),    -- Staff PIN: 9012
    ('Staff 2', '3456', 'STAFF');    -- Staff PIN: 3456

-- Log the created staff members
INSERT INTO staff_activity_log (staff_id, action_type, details)
SELECT 
    id,
    'ACCOUNT_CREATED',
    json_build_object('name', name, 'role', role)
FROM staff;

-- Commit transaction
COMMIT; 