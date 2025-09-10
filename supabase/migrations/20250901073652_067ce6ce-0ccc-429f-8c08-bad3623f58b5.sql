-- Create purchases table for marketplace transactions
CREATE TABLE public.purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL,
  buyer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  purchase_price NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  delivery_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mover_quotes table for moving service requests
CREATE TABLE public.mover_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL,
  user_id UUID NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  pickup_location TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  moving_date DATE NOT NULL,
  inventory TEXT,
  quote_amount NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mover_quotes ENABLE ROW LEVEL SECURITY;

-- Create policies for purchases
CREATE POLICY "Users can view their own purchases" 
ON public.purchases 
FOR SELECT 
USING (auth.uid()::text = buyer_id::text);

CREATE POLICY "Users can view their own sales" 
ON public.purchases 
FOR SELECT 
USING (auth.uid()::text = seller_id::text);

CREATE POLICY "Users can create purchases" 
ON public.purchases 
FOR INSERT 
WITH CHECK (auth.uid()::text = buyer_id::text);

-- Create policies for mover_quotes
CREATE POLICY "Users can view their own quotes" 
ON public.mover_quotes 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create mover quotes" 
ON public.mover_quotes 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_purchases_updated_at
BEFORE UPDATE ON public.purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mover_quotes_updated_at
BEFORE UPDATE ON public.mover_quotes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();