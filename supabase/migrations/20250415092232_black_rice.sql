/*
  # Restaurant Reservation System Schema

  1. New Tables
    - `tables`
      - `id` (uuid, primary key)
      - `number` (integer) - Table number
      - `capacity` (integer) - Number of seats
      - `is_active` (boolean) - Whether table is available for booking
      - `created_at` (timestamp)

    - `menu_categories`
      - `id` (uuid, primary key)
      - `name` (text) - Category name
      - `display_order` (integer) - Order to display categories
      - `created_at` (timestamp)

    - `menu_items`
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key)
      - `name` (text) - Item name
      - `description` (text) - Item description
      - `price` (decimal) - Item price
      - `image_url` (text) - Item image
      - `is_available` (boolean) - Whether item is available
      - `created_at` (timestamp)

    - `reservations`
      - `id` (uuid, primary key)
      - `table_id` (uuid, foreign key)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_phone` (text)
      - `party_size` (integer)
      - `reservation_date` (date)
      - `reservation_time` (time)
      - `status` (text) - 'pending', 'confirmed', 'cancelled'
      - `notes` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and anon access where appropriate
*/

-- Create tables
CREATE TABLE tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number integer NOT NULL,
  capacity integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  display_order integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES menu_categories(id),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  image_url text,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id uuid REFERENCES tables(id),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  party_size integer NOT NULL,
  reservation_date date NOT NULL,
  reservation_time time NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

-- Enable Row Level Security
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Policies for tables
CREATE POLICY "Tables are viewable by everyone" ON tables
  FOR SELECT USING (true);

CREATE POLICY "Tables are editable by authenticated users only" ON tables
  FOR ALL USING (auth.role() = 'authenticated');

-- Policies for menu_categories
CREATE POLICY "Menu categories are viewable by everyone" ON menu_categories
  FOR SELECT USING (true);

CREATE POLICY "Menu categories are editable by authenticated users only" ON menu_categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Policies for menu_items
CREATE POLICY "Menu items are viewable by everyone" ON menu_items
  FOR SELECT USING (true);

CREATE POLICY "Menu items are editable by authenticated users only" ON menu_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Policies for reservations
CREATE POLICY "Reservations are viewable by authenticated users" ON reservations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Reservations can be created by anyone" ON reservations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Reservations are editable by authenticated users only" ON reservations
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Reservations are deletable by authenticated users only" ON reservations
  FOR DELETE USING (auth.role() = 'authenticated');