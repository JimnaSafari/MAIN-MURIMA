-- Add support for multiple images in properties table
ALTER TABLE public.properties ADD COLUMN images JSONB DEFAULT '[]'::jsonb;

-- Update existing properties to include their image in the images array
UPDATE public.properties 
SET images = CASE 
  WHEN image IS NOT NULL AND image != '' THEN jsonb_build_array(image)
  ELSE '[]'::jsonb
END
WHERE images = '[]'::jsonb OR images IS NULL;