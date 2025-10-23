# Payment Integration

This directory contains payment processing routes and webhook handlers for PayPal and Stripe.

## Routes

### `/payments/create`
Create a new payment intent or order.

**Request:**
```json
{
  "amount": 2900,
  "currency": "USD",
  "provider": "stripe" | "paypal",
  "plan": "starter" | "pro" | "enterprise",
  "customer_email": "user@example.com"
}
```

**Response:**
```json
{
  "payment_id": "pi_123456789",
  "client_secret": "secret_123",
  "status": "pending"
}
```

### `/payments/webhook`
Handle payment provider webhooks for subscription renewals, refunds, and payment confirmations.

**Supported Events:**
- Stripe: `payment_intent.succeeded`, `invoice.paid`, `customer.subscription.updated`
- PayPal: `PAYMENT.CAPTURE.COMPLETED`, `BILLING.SUBSCRIPTION.ACTIVATED`

## Database Schema

Payments are stored in Supabase `payments` table:

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  amount INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  provider VARCHAR(20) NOT NULL,
  provider_payment_id VARCHAR(255),
  status VARCHAR(50),
  plan VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Testing

### Sandbox Mode
All development and testing should use sandbox/test credentials:

**Stripe Test Cards:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

**PayPal Sandbox:**
- Use PayPal Developer Dashboard sandbox accounts
- Test URL: https://www.sandbox.paypal.com

## Implementation Status
- [ ] Create payment route implementation
- [ ] Webhook handler implementation
- [ ] Database integration
- [ ] Error handling and logging
- [ ] Sandbox testing
- [ ] Production deployment
