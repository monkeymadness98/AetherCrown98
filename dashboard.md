# 📊 AetherCrown98 Analytics Dashboard

This document defines the key metrics, KPIs, and analytics structure for monitoring business performance.

---

## 🎯 Key Performance Indicators (KPIs)

### Business Metrics

#### Monthly Recurring Revenue (MRR)
**Definition:** Total predictable monthly revenue from subscriptions

**Formula:** `SUM(active_subscriptions.monthly_value)`

**Targets:**
- Month 1: $1,000
- Month 3: $5,000
- Month 6: $25,000
- Month 12: $100,000

**Dashboard Display:**
- Current MRR
- MRR Growth Rate (MoM %)
- MRR by Plan (Starter/Pro/Enterprise breakdown)
- Trend chart (last 12 months)

---

#### Annual Recurring Revenue (ARR)
**Definition:** MRR × 12

**Formula:** `MRR * 12`

**Targets:**
- Year 1: $1.2M
- Year 2: $5M
- Year 3: $20M

---

#### Churn Rate
**Definition:** Percentage of customers who cancel their subscription

**Formula:** `(Cancelled Subscriptions / Total Active Subscriptions at Start) * 100`

**Acceptable Ranges:**
- Excellent: < 5%
- Good: 5-7%
- Acceptable: 7-10%
- Poor: > 10%

**Breakdown:**
- Voluntary churn (customer cancels)
- Involuntary churn (payment failure)
- By plan tier
- By customer segment

---

#### Customer Lifetime Value (LTV)
**Definition:** Predicted revenue from a customer over their entire relationship

**Formula:** `(Average Revenue Per User × Average Customer Lifespan) - Cost of Acquisition`

**Targets:**
- Starter: $100
- Pro: $1,000
- Enterprise: $50,000+

**Related Metrics:**
- Average subscription length
- Expansion revenue (upgrades)
- Contraction revenue (downgrades)

---

#### Customer Acquisition Cost (CAC)
**Definition:** Cost to acquire a new customer

**Formula:** `(Sales + Marketing Costs) / Number of New Customers`

**Targets:**
- Target CAC: < $100 for Pro
- Target CAC: < $5,000 for Enterprise

**Components:**
- Marketing spend
- Sales team costs
- Software/tools costs
- Advertising costs

---

#### CAC Payback Period
**Definition:** Time to recover customer acquisition cost

**Formula:** `CAC / (MRR per Customer × Gross Margin %)`

**Targets:**
- Excellent: < 6 months
- Good: 6-12 months
- Acceptable: 12-18 months
- Poor: > 18 months

---

#### LTV:CAC Ratio
**Definition:** Relationship between customer value and acquisition cost

**Formula:** `LTV / CAC`

**Targets:**
- Minimum acceptable: 3:1
- Strong: 4:1 to 5:1
- Excellent: > 5:1

---

### Growth Metrics

#### Activation Rate
**Definition:** Percentage of users who complete key onboarding actions

**Key Actions:**
- Create account
- Complete profile
- Make first API call
- Integrate payment method
- Generate first report

**Formula:** `(Users Who Complete Activation / Total Signups) * 100`

**Targets:**
- Day 1: > 40%
- Day 7: > 60%
- Day 30: > 75%

---

#### Conversion Rate (Trial to Paid)
**Definition:** Percentage of trial users who become paying customers

**Formula:** `(Paid Conversions / Trial Starts) * 100`

**Targets:**
- Overall: > 15%
- With onboarding call: > 30%
- Self-serve: > 10%

**Segmentation:**
- By traffic source
- By user role/industry
- By engagement level

---

#### Net Promoter Score (NPS)
**Definition:** Customer satisfaction and loyalty metric

**Question:** "How likely are you to recommend AetherCrown98 to a friend or colleague?" (0-10)

**Categories:**
- Promoters (9-10)
- Passives (7-8)
- Detractors (0-6)

**Formula:** `% Promoters - % Detractors`

**Targets:**
- Good: > 30
- Excellent: > 50
- World-class: > 70

---

### Technical Metrics

#### API Usage
**Metrics to Track:**
- Total API calls per day/week/month
- Calls by endpoint
- Average response time
- Error rate
- Rate limit hits

**Dashboard Views:**
- Real-time usage graph
- Usage by customer tier
- Top endpoints
- Error trends

---

#### System Uptime
**Definition:** Percentage of time system is available

**Formula:** `(Total Time - Downtime) / Total Time * 100`

**SLA Targets:**
- Starter: 99.5% (3.6 hours downtime/month)
- Pro: 99.9% (43 minutes downtime/month)
- Enterprise: 99.99% (4.3 minutes downtime/month)

**Monitoring:**
- Health check success rate
- Response time (p50, p95, p99)
- Failed requests
- Service availability by region

---

#### Page Load Time
**Metrics:**
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Time to Interactive (TTI)
- Largest Contentful Paint (LCP)

**Targets:**
- TTFB: < 200ms
- FCP: < 1s
- TTI: < 3s
- LCP: < 2.5s

---

### User Engagement Metrics

#### Daily Active Users (DAU)
**Definition:** Unique users who log in and use the platform each day

**Trends to Monitor:**
- DAU growth rate
- DAU by plan tier
- Weekend vs. weekday patterns

---

#### Monthly Active Users (MAU)
**Definition:** Unique users who use the platform in a 30-day period

**Related Metrics:**
- DAU/MAU ratio (stickiness)
- New vs. returning users
- User retention cohorts

---

#### Feature Adoption
**Track Usage of:**
- Payment processing
- Analytics dashboard
- API integrations
- Custom reports
- Team collaboration features

**Metrics:**
- % of users who have tried feature
- Average usage frequency
- Time to first use
- Power users vs. casual users

---

## 📈 Analytics Events Structure

### Event Categories

#### User Events
```javascript
{
  event: 'user_signup',
  user_id: 'uuid',
  email: 'user@example.com',
  plan: 'starter',
  source: 'organic',
  timestamp: '2025-10-23T10:00:00Z'
}
```

#### Payment Events
```javascript
{
  event: 'payment_completed',
  user_id: 'uuid',
  amount: 2900,
  currency: 'USD',
  provider: 'stripe',
  plan: 'pro',
  timestamp: '2025-10-23T10:00:00Z'
}
```

#### API Events
```javascript
{
  event: 'api_call',
  user_id: 'uuid',
  endpoint: '/api/users',
  method: 'GET',
  status_code: 200,
  response_time: 145,
  timestamp: '2025-10-23T10:00:00Z'
}
```

#### Conversion Events
```javascript
{
  event: 'trial_started',
  user_id: 'uuid',
  plan: 'pro',
  source: 'landing_page',
  campaign: 'summer_2025',
  timestamp: '2025-10-23T10:00:00Z'
}
```

---

## 🗄️ Database Schema

### analytics_events Table
```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES users(id),
  event_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_event_data ON analytics_events USING GIN(event_data);
```

---

## 📊 Dashboard Layout

### Executive Dashboard (CEO View)
**Top Row:**
- MRR (current + growth %)
- ARR (current + target %)
- Active Customers
- Churn Rate

**Charts:**
- MRR trend (12 months)
- New customers by source
- Revenue by plan tier
- Geographic distribution

**Bottom:**
- Recent enterprise deals
- Key alerts/notifications

---

### Product Dashboard
**Metrics:**
- DAU/MAU
- Feature adoption rates
- API usage trends
- Error rates
- Page performance

**Charts:**
- User engagement funnel
- Feature usage heatmap
- API endpoint performance
- Error trends

---

### Marketing Dashboard
**Metrics:**
- Traffic sources
- Conversion rates
- CAC by channel
- Campaign performance

**Charts:**
- Funnel visualization
- Attribution model
- Content performance
- Social media metrics

---

### Sales Dashboard
**Metrics:**
- Pipeline value
- Conversion rates by stage
- Average deal size
- Sales cycle length

**Views:**
- Open opportunities
- Recent wins/losses
- Team performance
- Forecast vs. actual

---

## 🔗 Integration Points

### Sentry (Error Tracking)
- Application errors
- Performance monitoring
- Release tracking
- User feedback

**Setup:**
```javascript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.ENVIRONMENT,
  tracesSampleRate: 1.0,
});
```

### Healthchecks.io (Uptime Monitoring)
- Endpoint monitoring every 15 minutes
- Alert on failure
- Track uptime percentage
- Response time tracking

**Ping URL:** `https://hc-ping.com/YOUR_CHECK_UUID`

---

## 📤 Reporting

### Daily Reports (Automated)
- DAU
- MRR change
- New signups
- Critical errors
- System uptime

### Weekly Reports
- Signup trends
- Conversion rates
- Feature adoption
- Top customers by usage
- Support ticket summary

### Monthly Reports
- MRR/ARR summary
- Churn analysis
- Customer cohort retention
- Revenue by segment
- Product roadmap progress

---

## 🎯 Goals & Targets

### Q1 2025
- 1,000 total users
- $25,000 MRR
- < 7% churn rate
- 99.9% uptime
- NPS > 40

### Q2 2025
- 5,000 total users
- $100,000 MRR
- < 5% churn rate
- 99.95% uptime
- NPS > 50

### 2025 Year End
- 20,000 total users
- $500,000 MRR
- < 5% churn rate
- 99.99% uptime
- NPS > 60

---

**Last Updated:** 2025-10-23  
**Version:** 1.0.0  
**Owner:** Analytics Team
