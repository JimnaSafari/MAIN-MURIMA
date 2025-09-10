-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles
FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

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

-- Add created_by column to all tables to track ownership
ALTER TABLE public.properties ADD COLUMN created_by TEXT;
ALTER TABLE public.marketplace_items ADD COLUMN created_by TEXT;
ALTER TABLE public.moving_services ADD COLUMN created_by TEXT;

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('marketplace-images', 'marketplace-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('service-images', 'service-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Create storage policies for property images
CREATE POLICY "Property images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Users can update their own property images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'property-images' AND owner = auth.uid());

CREATE POLICY "Users can delete their own property images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'property-images' AND owner = auth.uid());

-- Create storage policies for marketplace images
CREATE POLICY "Marketplace images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'marketplace-images');

CREATE POLICY "Authenticated users can upload marketplace images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'marketplace-images');

CREATE POLICY "Users can update their own marketplace images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'marketplace-images' AND owner = auth.uid());

CREATE POLICY "Users can delete their own marketplace images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'marketplace-images' AND owner = auth.uid());

-- Create storage policies for service images
CREATE POLICY "Service images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'service-images');

CREATE POLICY "Authenticated users can upload service images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'service-images');

CREATE POLICY "Users can update their own service images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'service-images' AND owner = auth.uid());

CREATE POLICY "Users can delete their own service images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'service-images' AND owner = auth.uid());

-- Create storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);