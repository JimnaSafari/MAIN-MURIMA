-- Update marketplace items to have proper created_by values (using first user if none exists)
UPDATE marketplace_items 
SET created_by = (
  SELECT id::text 
  FROM auth.users 
  WHERE email IS NOT NULL 
  LIMIT 1
)
WHERE created_by IS NULL;