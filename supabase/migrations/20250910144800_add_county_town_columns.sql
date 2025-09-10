-- Add county and town columns to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS county TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS town TEXT;

-- Add rental_type column if it doesn't exist
ALTER TABLE properties ADD COLUMN IF NOT EXISTS rental_type TEXT;
