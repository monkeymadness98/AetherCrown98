# API Reference

Base URL: `http://localhost:3000/api` (development) or `https://api.aethercrown.com` (production)

## Authentication

Most endpoints require authentication via JWT token.

```bash
Authorization: Bearer <your-jwt-token>
```

## Pricing Endpoints

### Calculate Dynamic Price

Get the current dynamic price for a product.

```
GET /api/pricing/calculate/:productId
```

**Response:**
```json
{
  "productId": "uuid",
  "price": 129.99
}
```

### Update All Prices

Trigger a manual price update for all products.

```
POST /api/pricing/update
```

**Response:**
```json
{
  "success": true,
  "updated": [
    { "id": "uuid", "price": 129.99 },
    { "id": "uuid", "price": 89.99 }
  ]
}
```

### Get Pricing Insights

Get AI-powered insights for product pricing.

```
GET /api/pricing/insights/:productId
```

**Response:**
```json
{
  "productId": "uuid",
  "currentPrice": 129.99,
  "basePrice": 100.00,
  "factors": {
    "demand": { "value": 0.15, "impact": "medium" },
    "supply": { "value": -0.05, "impact": "low" },
    "behavior": { "value": 0.10, "impact": "low" }
  },
  "recommendation": "increase"
}
```

## Revenue Endpoints

### Get Revenue Predictions

Get AI-generated revenue predictions.

```
GET /api/revenue/predictions?timeframe=30d
```

**Parameters:**
- `timeframe` - Prediction period (e.g., "30d", "60d", "90d")

**Response:**
```json
{
  "predictions": [
    {
      "date": "2024-01-01",
      "predicted_revenue": 15000.00,
      "confidence": 0.85
    }
  ],
  "summary": {
    "totalPredicted": 450000.00,
    "avgDailyRevenue": 15000.00,
    "growthRate": 0.05,
    "trend": "increasing"
  }
}
```

### Get Revenue Breakdown

Get revenue breakdown by product and category.

```
GET /api/revenue/breakdown
```

**Response:**
```json
{
  "byProduct": [
    { "productId": "uuid", "revenue": 50000.00 },
    { "productId": "uuid", "revenue": 35000.00 }
  ],
  "byCategory": [
    { "category": "Electronics", "revenue": 100000.00 },
    { "category": "Clothing", "revenue": 75000.00 }
  ]
}
```

### Get High-Value Markets

Identify high-value markets by country.

```
GET /api/revenue/markets/predictions
```

**Response:**
```json
[
  {
    "country": "US",
    "revenue": 100000.00,
    "users": 5000,
    "conversions": 500,
    "avgOrderValue": 200.00,
    "conversionRate": 0.10,
    "score": 1500,
    "potential": "high"
  }
]
```

## Payment Endpoints

### Create Payment

Create a one-time payment.

```
POST /api/payments/create
```

**Request Body:**
```json
{
  "amount": 99.99,
  "currency": "USD",
  "productId": "uuid",
  "userId": "uuid"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentId": "pi_xxx"
}
```

### Create Subscription

Create a recurring subscription.

```
POST /api/payments/subscription/create
```

**Request Body:**
```json
{
  "userId": "uuid",
  "planId": "uuid",
  "currency": "USD"
}
```

**Response:**
```json
{
  "subscriptionId": "sub_xxx",
  "status": "active",
  "currentPeriodEnd": "2024-02-01T00:00:00Z"
}
```

### Cancel Subscription

Cancel a subscription.

```
POST /api/payments/subscription/cancel
```

**Request Body:**
```json
{
  "subscriptionId": "sub_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "subscriptionId": "sub_xxx"
}
```

### Get Supported Currencies

Get list of supported payment currencies.

```
GET /api/payments/currencies
```

**Response:**
```json
[
  { "code": "USD", "symbol": "$", "name": "US Dollar" },
  { "code": "EUR", "symbol": "€", "name": "Euro" },
  { "code": "GBP", "symbol": "£", "name": "British Pound" }
]
```

## Analytics Endpoints

### Get Dashboard KPIs

Get key performance indicators for the dashboard.

```
GET /api/analytics/dashboard/kpis?timeframe=30d
```

**Response:**
```json
{
  "revenue": {
    "total": 150000.00,
    "daily": 5000.00,
    "growth": 12.5
  },
  "users": {
    "new": 1500,
    "growth": 8.3
  },
  "conversions": {
    "total": 750,
    "rate": 3.5
  },
  "orders": {
    "total": 500,
    "avgValue": 300.00
  },
  "traffic": {
    "total": 25000,
    "avgDaily": 833
  },
  "timeframe": "30d"
}
```

### Get Traffic Analytics

Get detailed traffic analytics.

```
GET /api/analytics/traffic?timeframe=30d
```

**Response:**
```json
{
  "daily": [
    {
      "date": "2024-01-01",
      "views": 850,
      "uniqueVisitors": 625,
      "bounceRate": 45,
      "avgTimeOnSite": 180
    }
  ],
  "topPages": [
    { "page": "/products", "views": 5000 },
    { "page": "/", "views": 3500 }
  ],
  "summary": {
    "totalViews": 25000,
    "totalUniqueVisitors": 18000,
    "avgBounceRate": 42
  }
}
```

### Get Conversion Metrics

Get conversion funnel metrics.

```
GET /api/analytics/conversions?timeframe=30d
```

**Response:**
```json
{
  "funnel": [
    { "stage": "visit", "count": 10000, "conversionRate": 0 },
    { "stage": "product_view", "count": 5000, "conversionRate": 50 },
    { "stage": "add_to_cart", "count": 2000, "conversionRate": 40 },
    { "stage": "checkout", "count": 1000, "conversionRate": 50 },
    { "stage": "purchase", "count": 500, "conversionRate": 50 }
  ],
  "bySource": [
    { "source": "organic", "count": 300 },
    { "source": "paid", "count": 150 }
  ],
  "summary": {
    "totalConversions": 500,
    "overallConversionRate": 5.0
  }
}
```

### Get Optimization Suggestions

Get AI-powered optimization suggestions.

```
GET /api/analytics/optimizations
```

**Response:**
```json
{
  "optimizations": [
    {
      "type": "pricing",
      "priority": "high",
      "product": "Product X",
      "suggestion": "Consider reducing price to improve sales velocity",
      "impact": "Reduce inventory holding costs"
    }
  ],
  "summary": {
    "total": 5,
    "critical": 1,
    "high": 2,
    "medium": 2
  }
}
```

## Marketing Endpoints

### Generate Marketing Content

Generate AI-powered marketing content.

```
POST /api/marketing/content/generate
```

**Request Body:**
```json
{
  "productId": "uuid",
  "type": "ad-copy",
  "platform": "facebook"
}
```

**Response:**
```json
{
  "content": "Discover the future of technology with our latest product...",
  "type": "ad-copy",
  "platform": "facebook"
}
```

### Create Campaign

Create a marketing campaign.

```
POST /api/marketing/campaigns/create
```

**Request Body:**
```json
{
  "name": "Summer Sale 2024",
  "type": "promotional",
  "targetSegment": "high-value",
  "budget": 10000.00,
  "startDate": "2024-06-01",
  "endDate": "2024-06-30",
  "channels": ["email", "social", "paid-ads"]
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Summer Sale 2024",
  "status": "active",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Get Customer Segments

Get AI-generated customer segments.

```
GET /api/marketing/segments
```

**Response:**
```json
{
  "high-value": ["user1", "user2"],
  "frequent-buyers": ["user3", "user4"],
  "at-risk": ["user5"],
  "new-customers": ["user6", "user7"],
  "international": ["user8"]
}
```

### Create A/B Test

Create an A/B test.

```
POST /api/marketing/ab-test/create
```

**Request Body:**
```json
{
  "name": "Homepage Hero Test",
  "description": "Testing two hero images",
  "variantA": { "image": "hero-a.jpg" },
  "variantB": { "image": "hero-b.jpg" },
  "metric": "conversion_rate",
  "targetUsers": 1000
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Homepage Hero Test",
  "status": "active",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Get A/B Test Results

Get results for an A/B test.

```
GET /api/marketing/ab-test/:testId/results
```

**Response:**
```json
{
  "testId": "uuid",
  "name": "Homepage Hero Test",
  "variantA": {
    "value": 0.045,
    "sampleSize": 500
  },
  "variantB": {
    "value": 0.052,
    "sampleSize": 500
  },
  "winner": "B",
  "improvement": 15.56,
  "status": "completed"
}
```

## Security Endpoints

### Get Security Status

Get overall security status.

```
GET /api/security/status
```

**Response:**
```json
{
  "overall": "secure",
  "threats": 0,
  "vulnerabilities": 0,
  "complianceScore": 95,
  "lastScan": "2024-01-01T00:00:00Z"
}
```

### Rotate API Keys

Manually trigger API key rotation.

```
POST /api/security/rotate-keys
```

**Response:**
```json
{
  "rotated": 5,
  "keys": ["key1", "key2", "key3", "key4", "key5"]
}
```

### Get Compliance Status

Get compliance status for regulations.

```
GET /api/security/compliance
```

**Response:**
```json
{
  "score": 95,
  "details": {
    "gdpr": {
      "total": 5,
      "passed": 5,
      "checks": [...]
    },
    "pciDss": {
      "total": 5,
      "passed": 5,
      "checks": [...]
    },
    "ccpa": {
      "total": 4,
      "passed": 4,
      "checks": [...]
    }
  },
  "status": "compliant"
}
```

## Competitor Analysis Endpoints

### Analyze Competitors

Analyze competitor data.

```
POST /api/competitor/analyze
```

**Request Body:**
```json
{
  "competitors": [
    { "name": "Competitor A", "url": "https://competitor-a.com" },
    { "name": "Competitor B", "url": "https://competitor-b.com" }
  ]
}
```

**Response:**
```json
[
  {
    "name": "Competitor A",
    "url": "https://competitor-a.com",
    "strengths": ["Established brand", "Large user base"],
    "weaknesses": ["Higher pricing", "Limited features"],
    "opportunities": ["Underserved market segments"],
    "threats": ["Market saturation"]
  }
]
```

### Get Market Trends

Get AI-detected market trends.

```
GET /api/competitor/trends
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "AI-powered personalization",
    "confidence": 0.85,
    "impact": "high",
    "description": "Increasing adoption of AI for personalized experiences",
    "recommendation": "Invest in AI personalization features"
  }
]
```

### Get Business Strategies

Get AI-generated business strategies.

```
GET /api/competitor/strategies
```

**Response:**
```json
[
  {
    "id": 1,
    "category": "growth",
    "name": "Market expansion to Asia-Pacific",
    "priority": "high",
    "expectedImpact": "Revenue increase of 30-40%",
    "timeline": "6-12 months",
    "requirements": ["Localization", "Regional partnerships"],
    "risks": ["Cultural adaptation", "Competition"]
  }
]
```

### Get Partnership Suggestions

Get AI-suggested partnerships.

```
GET /api/competitor/partnerships
```

**Response:**
```json
[
  {
    "id": 1,
    "partner": "CloudFlare",
    "type": "technology",
    "benefit": "Enhanced CDN and security",
    "priority": "high",
    "synergy": 0.85
  }
]
```

## Product Endpoints

### Get All Products

Get list of all products.

```
GET /api/products
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Product Name",
    "description": "Product description",
    "current_price": 99.99,
    "inventory_count": 150,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Get Product

Get single product by ID.

```
GET /api/products/:id
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Product Name",
  "description": "Product description",
  "current_price": 99.99,
  "base_price": 89.99,
  "inventory_count": 150,
  "pricing_factors": {
    "demand": 0.15,
    "supply": -0.05,
    "behavior": 0.10
  }
}
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API rate limits:
- 100 requests per minute per IP
- 1000 requests per hour per user

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```
