-- ===========================================
-- SEED DATA FOR DEVELOPMENT/TESTING
-- AetherCrown98 Database
-- ===========================================
-- ⚠️  WARNING: This file is for DEVELOPMENT ONLY
-- DO NOT run in production!
-- ===========================================

-- Clean existing test data (optional)
-- DELETE FROM analytics_events WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@test.example.com');
-- DELETE FROM payments WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@test.example.com');
-- DELETE FROM subscriptions WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@test.example.com');
-- DELETE FROM users WHERE email LIKE '%@test.example.com';

-- Insert test users
INSERT INTO users (email, full_name, company_name, plan_tier, email_verified, is_active) VALUES
    ('starter@test.example.com', 'Starter User', 'Starter Co', 'starter', true, true),
    ('pro@test.example.com', 'Pro User', 'Pro Company', 'pro', true, true),
    ('enterprise@test.example.com', 'Enterprise User', 'Enterprise Corp', 'enterprise', true, true);

-- Get user IDs for reference
DO $$
DECLARE
    starter_user_id UUID;
    pro_user_id UUID;
    enterprise_user_id UUID;
BEGIN
    SELECT id INTO starter_user_id FROM users WHERE email = 'starter@test.example.com';
    SELECT id INTO pro_user_id FROM users WHERE email = 'pro@test.example.com';
    SELECT id INTO enterprise_user_id FROM users WHERE email = 'enterprise@test.example.com';
    
    -- Insert subscriptions
    INSERT INTO subscriptions (user_id, plan, status, billing_cycle, amount, currency, provider, provider_subscription_id, current_period_start, current_period_end) VALUES
        (pro_user_id, 'pro', 'active', 'monthly', 2900, 'USD', 'stripe', 'sub_test_pro_123', NOW(), NOW() + INTERVAL '30 days'),
        (enterprise_user_id, 'enterprise', 'active', 'annually', 120000, 'USD', 'stripe', 'sub_test_ent_456', NOW(), NOW() + INTERVAL '365 days');
    
    -- Insert payments
    INSERT INTO payments (user_id, amount, currency, status, provider, provider_payment_id, payment_method, description, paid_at) VALUES
        (pro_user_id, 2900, 'USD', 'succeeded', 'stripe', 'pi_test_123', 'card', 'Pro Plan Monthly', NOW() - INTERVAL '1 day'),
        (enterprise_user_id, 120000, 'USD', 'succeeded', 'stripe', 'pi_test_456', 'invoice', 'Enterprise Plan Annual', NOW() - INTERVAL '2 days');
    
    -- Insert analytics events
    INSERT INTO analytics_events (event_type, user_id, event_data, created_at) VALUES
        ('user_signup', starter_user_id, '{"source": "organic", "campaign": null}'::jsonb, NOW() - INTERVAL '7 days'),
        ('trial_started', pro_user_id, '{"plan": "pro", "source": "landing_page"}'::jsonb, NOW() - INTERVAL '5 days'),
        ('payment_completed', pro_user_id, '{"amount": 2900, "plan": "pro"}'::jsonb, NOW() - INTERVAL '1 day'),
        ('feature_used', pro_user_id, '{"feature": "automation", "count": 1}'::jsonb, NOW() - INTERVAL '2 hours'),
        ('api_call', pro_user_id, '{"endpoint": "/api/users", "status": 200}'::jsonb, NOW() - INTERVAL '1 hour'),
        ('user_signup', enterprise_user_id, '{"source": "sales", "campaign": "enterprise_q1"}'::jsonb, NOW() - INTERVAL '10 days'),
        ('payment_completed', enterprise_user_id, '{"amount": 120000, "plan": "enterprise"}'::jsonb, NOW() - INTERVAL '2 days');
END $$;

-- Verify seed data
SELECT 'Users created:' AS info, COUNT(*) AS count FROM users WHERE email LIKE '%@test.example.com';
SELECT 'Subscriptions created:' AS info, COUNT(*) AS count FROM subscriptions;
SELECT 'Payments created:' AS info, COUNT(*) AS count FROM payments;
SELECT 'Analytics events created:' AS info, COUNT(*) AS count FROM analytics_events;

-- Show test user summary
SELECT 
    u.email,
    u.plan_tier,
    COALESCE(s.status, 'no subscription') AS subscription_status,
    COALESCE(s.amount, 0) AS subscription_amount,
    COUNT(p.id) AS payment_count,
    COALESCE(SUM(p.amount), 0) AS total_paid
FROM users u
LEFT JOIN subscriptions s ON u.id = s.user_id
LEFT JOIN payments p ON u.id = p.user_id
WHERE u.email LIKE '%@test.example.com'
GROUP BY u.email, u.plan_tier, s.status, s.amount;
