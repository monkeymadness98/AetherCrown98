# 🚀 AetherCrown98 Deployment Checklist

This document outlines all environment variables and secrets that must be configured in both Render (Backend) and Vercel (Frontend) dashboards before deployment.

---

## 📋 Pre-Deployment Requirements

- [ ] Supabase project created and credentials obtained
- [ ] PayPal developer account set up (sandbox and production)
- [ ] Stripe account configured with API keys
- [ ] Sentry project created for error tracking
- [ ] Healthchecks.io account set up for monitoring
- [ ] Render account with backend service created
- [ ] Vercel account with frontend project created

---

## 🔹 RENDER (Backend Configuration)

**Service:** `aethercrown98-backend`  
**Dashboard:** [Render Dashboard](https://dashboard.render.com)  
**Location:** Your Service → Environment Tab → Add Environment Variable

### Required Environment Variables:

#### Supabase Configuration
```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```
**Where to find:**
- Log into [Supabase Dashboard](https://supabase.com/dashboard)
- Select your project
- Go to Project Settings → API
- Copy the URL and service_role key (keep secret!)

#### Payment Configuration
```bash
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```
**Where to find:**
- PayPal: [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/) → Apps & Credentials
- Stripe: [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API Keys

#### URLs
```bash
FRONTEND_URL=https://your-vercel-domain.vercel.app
BACKEND_URL=https://aethercrown98-backend.onrender.com
```

#### Monitoring & Logging
```bash
SENTRY_DSN=your_sentry_dsn
HEALTHCHECKS_URL=your_healthchecks_ping_url
```
**Where to find:**
- Sentry: [Sentry Dashboard](https://sentry.io) → Settings → Projects → Your Project → Client Keys (DSN)
- Healthchecks: [Healthchecks.io](https://healthchecks.io) → Add Check → Copy ping URL

#### General Configuration
```bash
ENVIRONMENT=production
PORT=10000
```

### ✅ Render Deployment Steps:
1. Navigate to your Render service dashboard
2. Click on "Environment" tab
3. Add each variable listed above
4. Click "Save Changes"
5. Go to "Manual Deploy" → Click "Clear build cache & deploy"
6. Monitor logs for: `Deployment successful. Listening on port 10000`
7. Test health endpoint: `https://aethercrown98-backend.onrender.com/healthz` (should return 200 OK)

---

## 🔹 VERCEL (Frontend Configuration)

**Project:** `aethercrown98-frontend`  
**Dashboard:** [Vercel Dashboard](https://vercel.com/dashboard)  
**Location:** Project Settings → Environment Variables

### Required Environment Variables:

#### Backend API
```bash
NEXT_PUBLIC_API_URL=https://aethercrown98-backend.onrender.com
```

#### Payment Configuration (Public Keys Only)
```bash
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
```
**Note:** Use PUBLISHABLE/PUBLIC keys only, never secret keys on frontend!

#### Analytics & Monitoring
```bash
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

#### Supabase (Frontend SDK)
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
**Where to find:** Supabase Dashboard → Project Settings → API → anon/public key

#### General Configuration
```bash
ENVIRONMENT=production
```

### ✅ Vercel Deployment Steps:
1. Navigate to your Vercel project
2. Go to Settings → Environment Variables
3. Add each variable for: Production, Preview, and Development environments
4. Save all variables
5. Trigger deployment:
   - Go to Deployments tab
   - Click "Redeploy" on latest deployment, OR
   - Push to `main` branch to trigger auto-deploy
6. Verify deployment:
   - Visit your domain (e.g., `https://aethercrown98.vercel.app`)
   - Check browser console for errors
   - Test API connectivity in Network tab
   - Verify PayPal/Stripe buttons render correctly

---

## 🔧 Optional: CLI Setup (Advanced)

### Render CLI:
```bash
render env:set SUPABASE_URL=<value>
render env:set SUPABASE_SERVICE_ROLE_KEY=<value>
render env:set PAYPAL_CLIENT_ID=<value>
render env:set PAYPAL_SECRET=<value>
render env:set STRIPE_SECRET_KEY=<value>
render env:set FRONTEND_URL=https://aethercrown98-frontend.vercel.app
render env:set SENTRY_DSN=<value>
render env:set HEALTHCHECKS_URL=<value>
render deploy aethercrown98-backend
```

### Vercel CLI:
```bash
vercel env add NEXT_PUBLIC_API_URL production https://aethercrown98-backend.onrender.com
vercel env add NEXT_PUBLIC_PAYPAL_CLIENT_ID production <value>
vercel env add NEXT_PUBLIC_STRIPE_PUBLIC_KEY production <value>
vercel env add NEXT_PUBLIC_SENTRY_DSN production <value>
vercel env add NEXT_PUBLIC_SUPABASE_URL production <value>
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <value>
vercel deploy --prod
```

---

## ✅ POST-DEPLOYMENT VALIDATION

### Backend Health Check
- [ ] `https://aethercrown98-backend.onrender.com/healthz` returns 200 OK
- [ ] Backend logs show "Deployment successful"
- [ ] No errors in Render logs

### Frontend Health Check
- [ ] Frontend loads at `https://aethercrown98-frontend.vercel.app`
- [ ] No console errors in browser
- [ ] API calls to backend succeed (check Network tab)
- [ ] Payment buttons (PayPal/Stripe) render correctly

### Payments
- [ ] PayPal sandbox test transaction completes successfully
- [ ] Stripe sandbox test payment completes successfully
- [ ] Transaction appears in Supabase `payments` table

### Monitoring
- [ ] Sentry receives first event (test error)
- [ ] Healthchecks.io shows "Up" status
- [ ] Analytics events logged to Supabase `analytics_events` table

### Database
- [ ] Supabase tables exist: `users`, `payments`, `analytics_events`, `subscriptions`
- [ ] Foreign key constraints are correct
- [ ] Test data seeded successfully

---

## 🚨 TROUBLESHOOTING

### Backend deployment fails:
1. Check Render logs for specific error
2. Verify all environment variables are set
3. Clear build cache and redeploy
4. Check service health status

### Frontend build fails:
1. Check Vercel deployment logs
2. Verify all `NEXT_PUBLIC_*` variables are set
3. Test build locally: `npm run build`
4. Check for missing dependencies

### API connection fails:
1. Verify `NEXT_PUBLIC_API_URL` matches backend URL
2. Check CORS settings on backend
3. Verify backend is running and healthy
4. Check network tab for specific error codes

### Payments not working:
1. Verify you're using correct keys (sandbox vs. production)
2. Check PayPal/Stripe dashboard for webhook errors
3. Verify payment table exists in Supabase
4. Check backend logs for payment processing errors

---

## 📞 SUPPORT

For issues or questions:
- Check logs in Render and Vercel dashboards
- Review `/logs/deploy.log` for detailed error messages
- Consult `/monitoring/alert.md` for incident playbooks
- Contact: support@aethercrown98.com

---

**Last Updated:** 2025-10-23  
**Version:** 1.0.0
