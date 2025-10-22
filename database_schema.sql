-- AetherCrown98 Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- AI Clones table
CREATE TABLE IF NOT EXISTS public.clones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  capabilities JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clones_status ON public.clones(status);
CREATE INDEX IF NOT EXISTS idx_clones_type ON public.clones(type);

-- Add RLS for clones
ALTER TABLE public.clones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view clones" ON public.clones
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create clones" ON public.clones
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update clones" ON public.clones
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete clones" ON public.clones
  FOR DELETE USING (auth.role() = 'authenticated');

-- AI Tasks table
CREATE TABLE IF NOT EXISTS public.ai_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clone_id UUID REFERENCES public.clones(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  input_data JSONB DEFAULT '{}'::jsonb,
  output_data JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_tasks_clone_id ON public.ai_tasks(clone_id);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_status ON public.ai_tasks(status);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_created_at ON public.ai_tasks(created_at DESC);

-- Add RLS for ai_tasks
ALTER TABLE public.ai_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tasks" ON public.ai_tasks
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create tasks" ON public.ai_tasks
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update tasks" ON public.ai_tasks
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete tasks" ON public.ai_tasks
  FOR DELETE USING (auth.role() = 'authenticated');

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  order_id TEXT UNIQUE,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);

-- Add RLS for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create payments" ON public.payments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Logs table
CREATE TABLE IF NOT EXISTS public.logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action_type TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_logs_action_type ON public.logs(action_type);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON public.logs(timestamp DESC);

-- Add RLS for logs
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view logs" ON public.logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert logs" ON public.logs
  FOR INSERT WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clones_updated_at BEFORE UPDATE ON public.clones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_tasks_updated_at BEFORE UPDATE ON public.ai_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.clones (name, type, capabilities, status) VALUES
  ('Marketing Bot Alpha', 'marketer', '["content_generation", "social_media", "email_campaigns"]', 'active'),
  ('Data Analyst Beta', 'analyst', '["data_analysis", "report_generation", "visualization"]', 'active'),
  ('Support Bot Gamma', 'support', '["customer_support", "ticket_management", "faq_responses"]', 'active');

INSERT INTO public.ai_tasks (clone_id, task_type, status, input_data, output_data) VALUES
  ((SELECT id FROM public.clones WHERE name = 'Marketing Bot Alpha'), 'content_generation', 'completed', '{"topic": "AI trends 2024"}', '{"content": "Generated content about AI trends..."}'),
  ((SELECT id FROM public.clones WHERE name = 'Data Analyst Beta'), 'data_analysis', 'running', '{"dataset": "sales_q4_2024"}', '{}'),
  ((SELECT id FROM public.clones WHERE name = 'Support Bot Gamma'), 'customer_support', 'pending', '{"ticket_id": "12345"}', '{}');

-- Create a function for real-time notifications
CREATE OR REPLACE FUNCTION notify_task_changes()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('task_changes', json_build_object(
    'operation', TG_OP,
    'record', row_to_json(NEW)
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for real-time task updates
CREATE TRIGGER task_changes_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.ai_tasks
FOR EACH ROW EXECUTE FUNCTION notify_task_changes();
