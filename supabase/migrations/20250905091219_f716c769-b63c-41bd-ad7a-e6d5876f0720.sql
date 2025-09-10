-- Fix security warnings: Update auth configuration
UPDATE auth.config 
SET 
  site_url = 'https://a69f5c4c-b147-492c-a577-fabce377546f.sandbox.lovable.dev',
  password_min_length = 8,
  password_score = 3,
  password_history = 5,
  jwt_exp = 3600,
  refresh_token_rotation_enabled = true,
  security_update_password_require_reauthentication = true
WHERE true;