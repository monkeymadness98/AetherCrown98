# Database Schema Documentation

This document describes the database schema for AetherCrown98, optimized for Supabase PostgreSQL.

## Tables

### 1. users
User authentication and profile information.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### 2. ai_clones
AI clone configurations and metadata.

```sql
CREATE TABLE ai_clones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  model_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_clones_user_id ON ai_clones(user_id);
CREATE INDEX idx_clones_status ON ai_clones(status);
CREATE INDEX idx_clones_created_at ON ai_clones(created_at DESC);
CREATE INDEX idx_clones_config ON ai_clones USING GIN (config);
```

### 3. ai_tasks
Task management and execution tracking.

```sql
CREATE TABLE ai_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clone_id UUID REFERENCES ai_clones(id) ON DELETE CASCADE,
  task_name VARCHAR(255) NOT NULL,
  task_input JSONB DEFAULT '{}',
  task_output JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(50) DEFAULT 'medium',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for querying and filtering
CREATE INDEX idx_tasks_clone_id ON ai_tasks(clone_id);
CREATE INDEX idx_tasks_status ON ai_tasks(status);
CREATE INDEX idx_tasks_priority ON ai_tasks(priority);
CREATE INDEX idx_tasks_created_at ON ai_tasks(created_at DESC);
CREATE INDEX idx_tasks_completed_at ON ai_tasks(completed_at DESC);
CREATE INDEX idx_tasks_input ON ai_tasks USING GIN (task_input);
CREATE INDEX idx_tasks_output ON ai_tasks USING GIN (task_output);
```

### 4. payments
Payment transaction records.

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(255) UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'created',
  description TEXT,
  payment_method VARCHAR(50) DEFAULT 'paypal',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes for payment queries
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX idx_payments_amount ON payments(amount);
CREATE INDEX idx_payments_metadata ON payments USING GIN (metadata);
```

### 5. activity_logs
System activity and audit logs.

```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  action VARCHAR(255) NOT NULL,
  details JSONB DEFAULT '{}',
  level VARCHAR(50) DEFAULT 'info',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes for log queries
CREATE INDEX idx_logs_type ON activity_logs(log_type);
CREATE INDEX idx_logs_entity_id ON activity_logs(entity_id);
CREATE INDEX idx_logs_level ON activity_logs(level);
CREATE INDEX idx_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX idx_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_logs_details ON activity_logs USING GIN (details);

-- Partition by date for better performance (optional)
-- CREATE TABLE activity_logs_2025_01 PARTITION OF activity_logs
-- FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

## JSONB Field Structures

### ai_clones.config
```json
{
  "model_version": "4.0",
  "temperature": 0.7,
  "max_tokens": 2000,
  "custom_parameters": {}
}
```

### ai_tasks.task_input
```json
{
  "dataset": "sales_data.csv",
  "analysis_type": "trend",
  "date_range": {
    "start": "2024-01-01",
    "end": "2024-12-31"
  }
}
```

### ai_tasks.task_output
```json
{
  "result": "success",
  "data": {
    "processed_records": 1000,
    "insights": ["insight1", "insight2"]
  },
  "execution_time": "5.2s"
}
```

### payments.metadata
```json
{
  "customer_name": "John Doe",
  "invoice_number": "INV-2024-001",
  "tax_amount": 10.00,
  "discount": 5.00
}
```

### activity_logs.details
```json
{
  "previous_state": "pending",
  "new_state": "completed",
  "changed_fields": ["status", "completed_at"],
  "ip_address": "192.168.1.1"
}
```

## Row Level Security (RLS)

Enable RLS for multi-tenant security:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_clones ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Example policies (customize based on your needs)
-- Users can only see their own data
CREATE POLICY user_select_own ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY clone_select_own ON ai_clones
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY task_select_clone ON ai_tasks
  FOR SELECT USING (
    clone_id IN (
      SELECT id FROM ai_clones WHERE user_id = auth.uid()
    )
  );
```

## Triggers

### Update updated_at timestamps

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clones_updated_at
  BEFORE UPDATE ON ai_clones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON ai_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Real-time Subscriptions

Enable real-time for tables:

```sql
-- In Supabase dashboard, enable real-time for:
-- - ai_clones
-- - ai_tasks
-- - payments
-- - activity_logs
```

## Performance Optimization

### 1. JSONB Indexes
Use GIN indexes for JSONB fields to enable fast queries:
```sql
CREATE INDEX idx_clone_config_gin ON ai_clones USING GIN (config);
```

### 2. Partial Indexes
Create indexes for frequently queried subsets:
```sql
CREATE INDEX idx_active_tasks ON ai_tasks(clone_id) 
  WHERE status IN ('pending', 'in_progress');
```

### 3. Composite Indexes
For common multi-column queries:
```sql
CREATE INDEX idx_tasks_clone_status ON ai_tasks(clone_id, status);
```

## Scaling Considerations

### 1. Table Partitioning
For large datasets, partition by date:
```sql
-- Partition activity_logs by month
CREATE TABLE activity_logs_partitioned (
  LIKE activity_logs INCLUDING ALL
) PARTITION BY RANGE (created_at);
```

### 2. Connection Pooling
Use PgBouncer or Supabase connection pooler for high concurrency.

### 3. Read Replicas
Set up read replicas for heavy read workloads.

### 4. Caching Strategy
- Cache frequently accessed clone configurations
- Cache aggregated statistics
- Use Redis/Memcached for session data

## Backup Strategy

1. **Automated backups**: Enable daily automated backups in Supabase
2. **Point-in-time recovery**: Keep 7 days of WAL logs
3. **Export important data**: Regular JSON exports of critical data
4. **Test restores**: Monthly restore testing

## Migration Scripts

When creating tables in Supabase:

1. Go to SQL Editor in Supabase Dashboard
2. Run the CREATE TABLE statements above
3. Enable Real-time for necessary tables
4. Set up RLS policies
5. Create triggers and indexes

## Monitoring

Monitor these metrics:
- Table sizes and growth
- Index usage statistics
- Slow query logs
- Connection pool usage
- Cache hit rates

```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```
