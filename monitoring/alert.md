# 🚨 Incident Response Playbook

This document provides step-by-step procedures for responding to various failure scenarios in the AetherCrown98 infrastructure.

---

## 📋 General Response Protocol

### Severity Levels
- **P0 (Critical)**: Complete outage, revenue impact
- **P1 (High)**: Partial outage, degraded performance
- **P2 (Medium)**: Non-critical feature broken
- **P3 (Low)**: Minor issue, no user impact

### Response Times
- P0: Immediate response (< 15 minutes)
- P1: 30 minutes
- P2: 2 hours
- P3: 24 hours

---

## 🔴 SCENARIO 1: Complete Downtime

### Symptoms
- Health check endpoints return 5xx errors
- Users cannot access the application
- Multiple monitoring alerts firing

### Immediate Actions (First 5 Minutes)
1. **Acknowledge the Incident**
   ```bash
   # Check current status
   curl -I https://aethercrown98-backend.onrender.com/healthz
   curl -I https://aethercrown98.vercel.app
   ```

2. **Check Service Status**
   - Render: https://dashboard.render.com
   - Vercel: https://vercel.com/dashboard
   - Supabase: https://supabase.com/dashboard

3. **Review Recent Changes**
   ```bash
   # Check last deployment
   git log -n 5 --oneline
   ```

### Investigation Steps (Next 10 Minutes)
1. **Check Logs**
   - Render: Service → Logs tab
   - Vercel: Deployments → Latest → View Function Logs
   - Browser Console: Check for JavaScript errors

2. **Verify Environment Variables**
   - Confirm all required variables are set
   - Check for typos or expired credentials

3. **Database Connectivity**
   ```bash
   # Test Supabase connection
   curl -X GET \
     -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     "https://your-project.supabase.co/rest/v1/"
   ```

### Resolution Steps
1. **If Recent Deployment Caused Issue**
   ```bash
   # Rollback in Render
   # Go to Deploys → Select previous working deploy → Redeploy
   
   # Rollback in Vercel
   # Go to Deployments → Select previous working deploy → Promote to Production
   ```

2. **If Service Provider Issue**
   - Check status pages:
     - https://status.render.com
     - https://vercel-status.com
     - https://status.supabase.com
   - Wait for resolution or switch to backup

3. **If Database Issue**
   - Check Supabase dashboard for locks or high load
   - Review slow query log
   - Scale up database if needed

### Communication
- Update status page (if available)
- Notify stakeholders via email/Slack
- Post updates every 15 minutes until resolved

---

## 🟡 SCENARIO 2: Failed Deployment

### Symptoms
- CI/CD pipeline shows red status
- Deployment logs show errors
- Application still running on previous version

### Immediate Actions
1. **Review Deployment Logs**
   ```bash
   # Check GitHub Actions
   # Go to Actions tab → Select failed workflow → Review logs
   ```

2. **Identify Failure Point**
   - Build failure
   - Test failure
   - Deployment failure

### Resolution by Failure Type

#### Build Failure
```bash
# Common causes:
# - Syntax errors
# - Missing dependencies
# - Type errors

# Fix:
1. Review error message in logs
2. Fix code locally
3. Test build: npm run build
4. Commit and push fix
```

#### Test Failure
```bash
# Common causes:
# - Breaking changes
# - Environment variable issues
# - External service unavailable

# Fix:
1. Run tests locally: npm test
2. Fix failing tests or code
3. Ensure tests pass locally
4. Commit and push fix
```

#### Deployment Failure
```bash
# Common causes:
# - Invalid deployment credentials
# - Quota exceeded
# - Service unavailable

# Fix:
1. Verify VERCEL_TOKEN and RENDER_API_KEY secrets
2. Check service quotas
3. Retry deployment manually if needed
```

### Prevention
- Run tests locally before pushing
- Use pre-commit hooks
- Implement gradual rollouts
- Maintain deployment checklist

---

## 🟠 SCENARIO 3: CI/CD Pipeline Errors

### Symptoms
- GitHub Actions workflow fails
- Tests pass locally but fail in CI
- Inconsistent behavior

### Common Issues & Solutions

#### Environment Variables Not Set
```yaml
# Check secrets in GitHub:
# Settings → Secrets and variables → Actions

Required secrets:
- SUPABASE_URL
- SUPABASE_KEY
- PAYPAL_CLIENT_ID
- PAYPAL_CLIENT_SECRET
- VERCEL_TOKEN
- VERCEL_TEAM_ID
- VERCEL_PROJECT_ID
- RENDER_API_KEY
```

#### Dependency Installation Fails
```bash
# Solution:
# 1. Clear npm cache
# 2. Delete package-lock.json
# 3. Regenerate: npm install
# 4. Commit updated package-lock.json
```

#### Test Flakiness
```bash
# Solutions:
# 1. Add proper waits in async tests
# 2. Mock external dependencies
# 3. Increase timeout for slow tests
# 4. Run tests multiple times to identify flaky tests
```

#### Workflow Permission Issues
```yaml
# Add to workflow file:
permissions:
  contents: read
  issues: write
  pull-requests: write
```

---

## 🟢 SCENARIO 4: Performance Degradation

### Symptoms
- Slow response times
- Timeouts
- High error rates
- Users complaining about slowness

### Investigation
1. **Check Metrics**
   - Response times in monitoring dashboard
   - Database query performance
   - API rate limits

2. **Identify Bottleneck**
   ```bash
   # Backend response times
   curl -w "@curl-format.txt" -o /dev/null -s https://aethercrown98-backend.onrender.com/api/endpoint
   
   # Database slow queries
   # Check Supabase → Database → Query Performance
   ```

3. **Resource Utilization**
   - Check CPU/Memory usage in Render
   - Check function execution times in Vercel
   - Check database connection pool

### Resolution
1. **Scale Up Resources**
   - Render: Upgrade plan or scale horizontally
   - Vercel: Check function timeout limits
   - Supabase: Upgrade database tier

2. **Optimize Code**
   - Add database indexes
   - Implement caching
   - Optimize queries
   - Add pagination

3. **Rate Limiting**
   - Implement API rate limiting
   - Add request queuing
   - Cache responses

---

## 💰 SCENARIO 5: Payment Processing Issues

### Symptoms
- Payment failures
- Webhook not received
- Transaction not recorded

### Immediate Actions
1. **Check Payment Provider Status**
   - PayPal: https://www.paypal-status.com
   - Stripe: https://status.stripe.com

2. **Verify Credentials**
   - Check API keys are correct
   - Verify sandbox vs. production mode
   - Check webhook signatures

3. **Review Logs**
   ```bash
   # Check payment processing logs
   # Look for:
   # - API errors
   # - Webhook failures
   # - Database write failures
   ```

### Resolution Steps
1. **Webhook Issues**
   ```bash
   # Verify webhook URL is correct
   # Check webhook endpoint is accessible
   # Verify webhook signature validation
   # Test webhook manually
   ```

2. **Database Issues**
   ```sql
   -- Check payments table
   SELECT * FROM payments 
   WHERE created_at > NOW() - INTERVAL '1 hour'
   ORDER BY created_at DESC;
   ```

3. **API Key Issues**
   - Regenerate keys if compromised
   - Update environment variables
   - Test with small transaction

### Prevention
- Monitor webhook delivery success rate
- Log all payment attempts
- Implement retry logic
- Set up alerts for failed payments

---

## 📊 Monitoring & Alerting

### Key Metrics to Monitor
1. **Uptime**
   - Health check success rate
   - Response time trends
   - Error rate

2. **Performance**
   - API response times (p50, p95, p99)
   - Database query times
   - Frontend load times

3. **Business Metrics**
   - Payment success rate
   - User signup rate
   - API usage

### Alert Thresholds
```yaml
Critical:
  - Uptime < 99%
  - Error rate > 5%
  - Response time p95 > 2s
  - Payment failure rate > 2%

Warning:
  - Uptime < 99.9%
  - Error rate > 1%
  - Response time p95 > 1s
  - Deployment time > 10min
```

---

## 🔧 Tools & Resources

### Dashboards
- Render: https://dashboard.render.com
- Vercel: https://vercel.com/dashboard
- Supabase: https://supabase.com/dashboard
- Sentry: https://sentry.io
- Healthchecks: https://healthchecks.io

### Commands
```bash
# Check service health
curl -I https://aethercrown98-backend.onrender.com/healthz
curl -I https://aethercrown98.vercel.app

# Check DNS
nslookup aethercrown98-backend.onrender.com
nslookup aethercrown98.vercel.app

# Check SSL certificate
openssl s_client -connect aethercrown98-backend.onrender.com:443 -servername aethercrown98-backend.onrender.com

# Test database connection
psql -h db.your-project.supabase.co -U postgres -d postgres
```

### Contacts
- On-call engineer: [contact info]
- DevOps lead: [contact info]
- CEO: Amin
- Emergency hotline: [phone number]

---

## 📝 Post-Incident Review

After resolving any incident, conduct a post-mortem:

1. **Timeline**
   - When was incident detected?
   - How long to acknowledge?
   - How long to resolve?

2. **Root Cause**
   - What caused the incident?
   - Why wasn't it caught earlier?

3. **Impact**
   - How many users affected?
   - Revenue impact?
   - Reputation impact?

4. **Action Items**
   - What can prevent this in the future?
   - What monitoring should be added?
   - What documentation needs updating?

5. **Document**
   - Add to incident log
   - Update runbooks
   - Share learnings with team

---

**Last Updated:** 2025-10-23  
**Version:** 1.0.0  
**Owner:** DevOps Team
