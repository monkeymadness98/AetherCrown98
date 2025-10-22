# Database Schema

## Tables

### products
Stores product information and dynamic pricing data.

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2) NOT NULL,
  base_cost DECIMAL(10, 2),
  current_price DECIMAL(10, 2) NOT NULL,
  inventory_count INTEGER DEFAULT 0,
  reorder_point INTEGER DEFAULT 50,
  sales_count INTEGER DEFAULT 0,
  pricing_factors JSONB,
  last_price_update TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### product_metrics
Tracks product views, sales, and engagement metrics.

```sql
CREATE TABLE product_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id),
  views INTEGER DEFAULT 0,
  sales INTEGER DEFAULT 0,
  cart_adds INTEGER DEFAULT 0,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### user_behavior
Tracks user interactions with products.

```sql
CREATE TABLE user_behavior (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  product_id UUID REFERENCES products(id),
  action VARCHAR(50),
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### revenue_daily
Daily revenue tracking for predictions.

```sql
CREATE TABLE revenue_daily (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  revenue DECIMAL(10, 2) NOT NULL,
  orders_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### revenue_predictions
Stores AI-generated revenue predictions.

```sql
CREATE TABLE revenue_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  predicted_revenue DECIMAL(10, 2) NOT NULL,
  confidence DECIMAL(3, 2),
  timeframe VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### revenue_breakdown
Revenue breakdown by product and category.

```sql
CREATE TABLE revenue_breakdown (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id),
  category VARCHAR(100),
  revenue DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### country_metrics
Country-level performance metrics.

```sql
CREATE TABLE country_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country VARCHAR(2),
  revenue DECIMAL(10, 2) DEFAULT 0,
  users INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### users
User accounts and customer data.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(255),
  country VARCHAR(2),
  password_strength VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### payments
Payment transaction records.

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  stripe_payment_id VARCHAR(255),
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  failed_at TIMESTAMP
);
```

### subscriptions
Subscription management.

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  plan_id UUID,
  stripe_subscription_id VARCHAR(255),
  status VARCHAR(20),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  cancelled_at TIMESTAMP
);
```

### subscription_plans
Available subscription plans.

```sql
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  interval VARCHAR(20),
  stripe_price_id VARCHAR(255),
  features JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### marketing_content
AI-generated marketing content.

```sql
CREATE TABLE marketing_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id),
  type VARCHAR(50),
  platform VARCHAR(50),
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### campaigns
Marketing campaigns.

```sql
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  target_segment VARCHAR(100),
  budget DECIMAL(10, 2),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  channels JSONB,
  status VARCHAR(20),
  conversions INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### ab_tests
A/B testing framework.

```sql
CREATE TABLE ab_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  variant_a JSONB,
  variant_b JSONB,
  metric VARCHAR(50),
  target_users INTEGER,
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### ab_test_results
Results from A/B tests.

```sql
CREATE TABLE ab_test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES ab_tests(id),
  variant VARCHAR(1),
  converted BOOLEAN,
  revenue DECIMAL(10, 2),
  engagement_score DECIMAL(5, 2),
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### page_views
Website traffic tracking.

```sql
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page VARCHAR(255),
  user_id UUID,
  count INTEGER DEFAULT 1,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### conversions
Conversion funnel tracking.

```sql
CREATE TABLE conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  stage VARCHAR(50),
  source VARCHAR(100),
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### orders
Order records.

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### user_sessions
Active user sessions for real-time metrics.

```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  last_activity TIMESTAMP DEFAULT NOW()
);
```

### api_keys
API key management.

```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  key VARCHAR(255) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### login_attempts
Security monitoring for login attempts.

```sql
CREATE TABLE login_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255),
  success BOOLEAN,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### api_logs
API usage logging.

```sql
CREATE TABLE api_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  endpoint VARCHAR(255),
  method VARCHAR(10),
  status_code INTEGER,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### security_alerts
Security alerts and notifications.

```sql
CREATE TABLE security_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50),
  severity VARCHAR(20),
  description TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### competitor_analysis
Competitor analysis results.

```sql
CREATE TABLE competitor_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### market_trends
Detected market trends.

```sql
CREATE TABLE market_trends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trends JSONB,
  detected_at TIMESTAMP DEFAULT NOW()
);
```

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_products_price ON products(current_price);
CREATE INDEX idx_product_metrics_product_id ON product_metrics(product_id);
CREATE INDEX idx_product_metrics_timestamp ON product_metrics(timestamp);
CREATE INDEX idx_revenue_daily_date ON revenue_daily(date);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_page_views_timestamp ON page_views(timestamp);
CREATE INDEX idx_conversions_timestamp ON conversions(timestamp);
CREATE INDEX idx_user_behavior_product_id ON user_behavior(product_id);
CREATE INDEX idx_country_metrics_country ON country_metrics(country);
```

## Setup Instructions

1. Create a Supabase project
2. Run the SQL scripts above in the Supabase SQL editor
3. Update `.env` with your Supabase credentials
4. The backend will automatically connect to the database
