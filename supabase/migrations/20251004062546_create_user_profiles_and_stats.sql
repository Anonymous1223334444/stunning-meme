/*
  # Create User Profiles and Website Statistics Tables

  ## Overview
  This migration creates the core database schema for user management and website analytics tracking.

  ## 1. New Tables

  ### `user_profiles` table
  Stores user account information and profiles:
  - `id` (uuid, primary key) - Matches auth.users id
  - `email` (text, unique, not null) - User email address
  - `full_name` (text) - User's full name
  - `role` (text, not null, default 'user') - User role (user or admin)
  - `avatar_url` (text) - Profile picture URL
  - `created_at` (timestamptz, default now()) - Account creation timestamp
  - `updated_at` (timestamptz, default now()) - Last profile update timestamp

  ### `website_stats` table
  Tracks website metrics and analytics:
  - `id` (uuid, primary key) - Unique stat entry identifier
  - `metric_name` (text, not null) - Name of the metric (e.g., 'total_projects', 'active_users')
  - `metric_value` (numeric, not null) - Current value of the metric
  - `metric_type` (text, not null) - Type category (e.g., 'project', 'user', 'activity')
  - `description` (text) - Human-readable description
  - `created_at` (timestamptz, default now()) - Stat creation timestamp
  - `updated_at` (timestamptz, default now()) - Last update timestamp

  ## 2. Security Configuration

  ### Row Level Security (RLS)
  - Both tables have RLS enabled for data protection
  
  ### Policies for `user_profiles`:
  1. **SELECT policy**: Authenticated users can view all profiles
  2. **UPDATE policy**: Users can only update their own profile
  3. **Admin SELECT policy**: Admins can view all profiles
  
  ### Policies for `website_stats`:
  1. **SELECT policy**: All authenticated users can view statistics
  2. **INSERT policy**: Only admins can add new statistics
  3. **UPDATE policy**: Only admins can update statistics
  4. **DELETE policy**: Only admins can delete statistics

  ## 3. Important Notes
  - The user_profiles.id references auth.users(id) via ON DELETE CASCADE
  - Default role is 'user' to ensure restrictive access
  - Admins are identified by role = 'admin'
  - All timestamps use timestamptz for timezone awareness
  - Indexes added for common query patterns (email lookups, role filtering)
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create website_stats table
CREATE TABLE IF NOT EXISTS website_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  metric_value numeric NOT NULL DEFAULT 0,
  metric_type text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_website_stats_metric_name ON website_stats(metric_name);
CREATE INDEX IF NOT EXISTS idx_website_stats_metric_type ON website_stats(metric_type);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_stats ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles

-- Allow authenticated users to view all profiles
CREATE POLICY "Users can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies for website_stats

-- Allow all authenticated users to view stats
CREATE POLICY "Authenticated users can view stats"
  ON website_stats FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can insert stats
CREATE POLICY "Admins can insert stats"
  ON website_stats FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Only admins can update stats
CREATE POLICY "Admins can update stats"
  ON website_stats FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Only admins can delete stats
CREATE POLICY "Admins can delete stats"
  ON website_stats FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert initial website stats
INSERT INTO website_stats (metric_name, metric_value, metric_type, description)
VALUES
  ('total_users', 0, 'user', 'Total number of registered users'),
  ('active_projects', 12, 'project', 'Number of active projects'),
  ('completed_projects', 8, 'project', 'Number of completed projects'),
  ('total_revenue', 125000, 'financial', 'Total revenue in USD'),
  ('monthly_active_users', 0, 'user', 'Users active in the last 30 days')
ON CONFLICT DO NOTHING;