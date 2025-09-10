-- Add foreign key relationships to support joins
ALTER TABLE public.bookings 
ADD CONSTRAINT fk_bookings_property 
FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;

ALTER TABLE public.purchases 
ADD CONSTRAINT fk_purchases_item 
FOREIGN KEY (item_id) REFERENCES public.marketplace_items(id) ON DELETE CASCADE;

ALTER TABLE public.mover_quotes 
ADD CONSTRAINT fk_quotes_service 
FOREIGN KEY (service_id) REFERENCES public.moving_services(id) ON DELETE CASCADE;