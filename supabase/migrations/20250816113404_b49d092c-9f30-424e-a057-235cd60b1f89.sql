-- Add created_by column to all tables to track ownership
ALTER TABLE public.properties ADD COLUMN created_by TEXT;
ALTER TABLE public.marketplace_items ADD COLUMN created_by TEXT;
ALTER TABLE public.moving_services ADD COLUMN created_by TEXT;

-- Update RLS policies for properties to allow CRUD operations
CREATE POLICY "Authenticated users can create properties"
ON public.properties
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update their own properties"
ON public.properties
FOR UPDATE
TO authenticated
USING (auth.uid()::text = created_by)
WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can delete their own properties"
ON public.properties
FOR DELETE
TO authenticated
USING (auth.uid()::text = created_by);

-- Update RLS policies for marketplace_items
CREATE POLICY "Authenticated users can create marketplace items"
ON public.marketplace_items
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update their own marketplace items"
ON public.marketplace_items
FOR UPDATE
TO authenticated
USING (auth.uid()::text = created_by)
WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can delete their own marketplace items"
ON public.marketplace_items
FOR DELETE
TO authenticated
USING (auth.uid()::text = created_by);

-- Update RLS policies for moving_services
CREATE POLICY "Authenticated users can create moving services"
ON public.moving_services
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update their own moving services"
ON public.moving_services
FOR UPDATE
TO authenticated
USING (auth.uid()::text = created_by)
WITH CHECK (auth.uid()::text = created_by);

CREATE POLICY "Users can delete their own moving services"
ON public.moving_services
FOR DELETE
TO authenticated
USING (auth.uid()::text = created_by);