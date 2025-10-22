# Deployment Guide

## Quick Start Deployment

### 1. Backend Deployment (Choose One)

#### Option A: Render
1. Go to https://render.com and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: `aethercrown98-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add Environment Variables:
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
6. Deploy!

#### Option B: Fly.io
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Deploy
cd backend
flyctl launch
flyctl secrets set PAYPAL_CLIENT_ID=xxx PAYPAL_CLIENT_SECRET=xxx SUPABASE_URL=xxx SUPABASE_ANON_KEY=xxx
flyctl deploy
```

### 2. Frontend Deployment (Vercel)

#### Option A: Vercel Dashboard
1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL` = Your backend URL (e.g., https://aethercrown98-backend.onrender.com)
6. Deploy!

#### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

### 3. Automated Deployment via GitHub Actions

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

**For Render:**
- `RENDER_API_KEY` - From https://dashboard.render.com/u/settings#api-keys
- `RENDER_SERVICE_ID` - From your service URL

**For Fly.io:**
- `FLY_API_TOKEN` - From `flyctl auth token`

**For Vercel:**
- `VERCEL_TOKEN` - From https://vercel.com/account/tokens
- `NEXT_PUBLIC_API_URL` - Your production backend URL

Once configured, pushing to `main` branch will automatically deploy!

## Getting API Keys

### PayPal
1. Go to https://developer.paypal.com/dashboard/
2. Create an app or use sandbox credentials
3. Copy Client ID and Secret

### Supabase
1. Go to https://app.supabase.com
2. Create a new project
3. Go to Settings → API
4. Copy Project URL and anon/public key

## Local Development

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Visit http://localhost:3000 to see the app!

## Troubleshooting

**Backend won't start?**
- Check that all environment variables are set
- Verify Node.js version is 18+
- Check logs for specific errors

**Frontend can't connect to backend?**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS settings if deployed
- Ensure backend is running and accessible

**Deployment failing?**
- Check GitHub Actions logs
- Verify all secrets are set correctly
- Ensure deployment platform has sufficient resources
