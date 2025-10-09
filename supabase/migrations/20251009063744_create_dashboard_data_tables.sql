/*
  # Create Dashboard Data Management Tables

  ## Overview
  This migration creates tables for managing all dashboard data including KPIs, tasks, 
  components, and chart data that admins can edit and users can view.

  ## 1. New Tables

  ### `dashboard_kpis` table
  Stores key performance indicators displayed on the dashboard:
  - `id` (uuid, primary key) - Unique KPI identifier
  - `key` (text, unique, not null) - Unique key for programmatic access (e.g., 'total_projects')
  - `label` (text, not null) - Display label (e.g., 'Total Activités')
  - `value` (numeric, not null) - Current value
  - `unit` (text) - Unit of measurement (e.g., 'M', '%', 'Mds FCFA')
  - `change` (text) - Change indicator (e.g., '+12%', '-5%')
  - `trend` (text) - Trend direction ('up', 'down', 'neutral')
  - `icon` (text) - Icon identifier
  - `color` (text) - Color class for styling
  - `order` (integer, default 0) - Display order
  - `is_active` (boolean, default true) - Whether to display this KPI
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### `project_components` table
  Stores project components/categories:
  - `id` (uuid, primary key) - Unique component identifier
  - `name` (text, not null) - Component name
  - `budget` (numeric, not null) - Allocated budget
  - `percentage` (integer) - Budget percentage
  - `icon` (text) - Icon/emoji
  - `progress` (integer, default 0) - Progress percentage (0-100)
  - `activities_count` (integer, default 0) - Number of activities
  - `blocked_count` (integer, default 0) - Number of blocked activities
  - `color` (text) - Color for charts
  - `order` (integer, default 0) - Display order
  - `is_active` (boolean, default true)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### `project_activities` table
  Stores all project activities/tasks:
  - `id` (uuid, primary key) - Unique activity identifier
  - `component_id` (uuid) - Foreign key to project_components
  - `activity_name` (text, not null) - Activity description
  - `responsible` (text) - Responsible person/organization
  - `status` (text, not null) - Status ('En cours', 'Terminé', 'Bloqué', 'Démarré')
  - `priority` (text, default 'normal') - Priority level ('high', 'normal', 'low')
  - `progress` (integer, default 0) - Progress percentage (0-100)
  - `tdr_done` (boolean, default false) - Terms of Reference completed
  - `marche_done` (boolean, default false) - Market/contract done
  - `contract_done` (boolean, default false) - Contract signed
  - `comment` (text) - Additional comments
  - `start_date` (date) - Activity start date
  - `end_date` (date) - Activity end date
  - `budget_allocated` (numeric) - Allocated budget
  - `budget_spent` (numeric) - Spent budget
  - `order` (integer, default 0) - Display order
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### `chart_data` table
  Stores data points for various charts:
  - `id` (uuid, primary key) - Unique data point identifier
  - `chart_key` (text, not null) - Chart identifier (e.g., 'budget_chart', 'progress_chart')
  - `label` (text, not null) - Data point label
  - `value` (numeric, not null) - Data point value
  - `category` (text) - Category/grouping
  - `color` (text) - Color for visualization
  - `order` (integer, default 0) - Display order
  - `metadata` (jsonb) - Additional metadata
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ## 2. Security Configuration

  ### Row Level Security (RLS)
  - All tables have RLS enabled for data protection
  
  ### Policies:
  1. **SELECT policies**: All authenticated users can view data
  2. **INSERT policies**: Only admins can add new data
  3. **UPDATE policies**: Only admins can update data
  4. **DELETE policies**: Only admins can delete data

  ## 3. Important Notes
  - Admins are identified by user_profiles.role = 'admin'
  - All tables include timestamps for audit trail
  - Foreign keys ensure data integrity
  - Indexes added for common query patterns
*/

-- Create dashboard_kpis table
CREATE TABLE IF NOT EXISTS dashboard_kpis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  label text NOT NULL,
  value numeric NOT NULL DEFAULT 0,
  unit text,
  change text,
  trend text CHECK (trend IN ('up', 'down', 'neutral')),
  icon text,
  color text,
  "order" integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create project_components table
CREATE TABLE IF NOT EXISTS project_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  budget numeric NOT NULL DEFAULT 0,
  percentage integer,
  icon text,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  activities_count integer DEFAULT 0,
  blocked_count integer DEFAULT 0,
  color text,
  "order" integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create project_activities table
CREATE TABLE IF NOT EXISTS project_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id uuid REFERENCES project_components(id) ON DELETE SET NULL,
  activity_name text NOT NULL,
  responsible text,
  status text NOT NULL CHECK (status IN ('En cours', 'Terminé', 'Bloqué', 'Démarré', 'Non démarré')),
  priority text DEFAULT 'normal' CHECK (priority IN ('high', 'normal', 'low')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  tdr_done boolean DEFAULT false,
  marche_done boolean DEFAULT false,
  contract_done boolean DEFAULT false,
  comment text,
  start_date date,
  end_date date,
  budget_allocated numeric,
  budget_spent numeric,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chart_data table
CREATE TABLE IF NOT EXISTS chart_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chart_key text NOT NULL,
  label text NOT NULL,
  value numeric NOT NULL,
  category text,
  color text,
  "order" integer DEFAULT 0,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_dashboard_kpis_key ON dashboard_kpis(key);
CREATE INDEX IF NOT EXISTS idx_dashboard_kpis_order ON dashboard_kpis("order");
CREATE INDEX IF NOT EXISTS idx_project_components_order ON project_components("order");
CREATE INDEX IF NOT EXISTS idx_project_activities_component ON project_activities(component_id);
CREATE INDEX IF NOT EXISTS idx_project_activities_status ON project_activities(status);
CREATE INDEX IF NOT EXISTS idx_chart_data_chart_key ON chart_data(chart_key);

-- Enable Row Level Security
ALTER TABLE dashboard_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_data ENABLE ROW LEVEL SECURITY;

-- Policies for dashboard_kpis
CREATE POLICY "Authenticated users can view KPIs"
  ON dashboard_kpis FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert KPIs"
  ON dashboard_kpis FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update KPIs"
  ON dashboard_kpis FOR UPDATE
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

CREATE POLICY "Admins can delete KPIs"
  ON dashboard_kpis FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Policies for project_components
CREATE POLICY "Authenticated users can view components"
  ON project_components FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert components"
  ON project_components FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update components"
  ON project_components FOR UPDATE
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

CREATE POLICY "Admins can delete components"
  ON project_components FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Policies for project_activities
CREATE POLICY "Authenticated users can view activities"
  ON project_activities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert activities"
  ON project_activities FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update activities"
  ON project_activities FOR UPDATE
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

CREATE POLICY "Admins can delete activities"
  ON project_activities FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Policies for chart_data
CREATE POLICY "Authenticated users can view chart data"
  ON chart_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert chart data"
  ON chart_data FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update chart data"
  ON chart_data FOR UPDATE
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

CREATE POLICY "Admins can delete chart data"
  ON chart_data FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Insert sample KPI data
INSERT INTO dashboard_kpis (key, label, value, unit, change, trend, icon, color, "order") VALUES
  ('total_projects', 'Total Activités', 45, NULL, '+12%', 'up', 'BarChart3', 'text-blue-600', 1),
  ('active_projects', 'En Cours', 28, NULL, '72%', 'up', 'Activity', 'text-green-600', 2),
  ('total_budget', 'Budget', 89.98, 'Mds FCFA', '89.98 Mds FCFA', 'neutral', 'DollarSign', 'text-purple-600', 3),
  ('blocked_projects', 'Bloquées', 8, NULL, '8 actions', 'down', 'AlertTriangle', 'text-red-600', 4)
ON CONFLICT (key) DO NOTHING;

-- Insert sample project components
INSERT INTO project_components (name, budget, percentage, icon, progress, activities_count, blocked_count, color, "order") VALUES
  ('Environnement Juridique & Réglementaire', 3.8, 4, '⚖️', 65, 8, 2, '#3b82f6', 1),
  ('Connectivité Haut Débit', 34.85, 38, '📡', 72, 5, 2, '#10b981', 2),
  ('Adoption Numérique', 22.18, 24, '💻', 68, 6, 2, '#f59e0b', 3),
  ('Digitalisation Santé', 29.15, 32, '🏥', 45, 6, 4, '#8b5cf6', 4)
ON CONFLICT DO NOTHING;