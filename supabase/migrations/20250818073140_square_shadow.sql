/*
# Create purchases table for marketplace transactions

1. New Tables
  - `purchases`
    - `id` (uuid, primary key)
    - `item_id` (uuid, references marketplace_items)
    - `buyer_id` (uuid, references auth.users)
    - `seller_id` (uuid, references auth.users)
    - `purchase_price` (numeric)
    - `status` (text, enum: pending, completed, cancelled)
    - `buyer_name` (text)
    - `buyer_email` (text)
    - `buyer_phone` (text)
    - `delivery_address` (text)
    - `created_at` (timestamp)
    - `updated_at` (timestamp)

2. Security
  - Enable RLS on `purchases` table
  - Add policies for buyers and sellers to manage their transactions
*/

CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL,
  buyer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  purchase_price NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  delivery_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Buyers can view their purchases
CREATE POLICY "Buyers can view their purchases"
  ON public.purchases
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = buyer_id::text);

-- Sellers can view purchases of their items
CREATE POLICY "Sellers can view purchases of their items"
  ON public.purchases
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = seller_id::text);

-- Authenticated users can create purchases
CREATE POLICY "Authenticated users can create purchases"
  ON public.purchases
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = buyer_id::text);

-- Buyers can update their purchases
CREATE POLICY "Buyers can update their purchases"
  ON public.purchases
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = buyer_id::text);

-- Sellers can update purchase status
CREATE POLICY "Sellers can update purchase status"
  ON public.purchases
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = seller_id::text);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_purchases_updated_at
  BEFORE UPDATE ON public.purchases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();