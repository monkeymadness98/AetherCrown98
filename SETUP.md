# AetherCrown98 Setup Guide

Complete setup instructions for the full-stack AI business empire platform.

## Overview

AetherCrown98 consists of:
- **Frontend**: Next.js 16 application (TypeScript, Tailwind CSS)
- **Backend**: FastAPI Python application (AI agents, payments, analytics)
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Payments**: PayPal & Stripe integration
- **AI**: OpenAI GPT-4 integration

## Prerequisites

### Local Development
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- Git
- npm or yarn
- pip

### Production Deployment
- Vercel account (frontend hosting)
- Render account (backend hosting)
- Supabase account (database)
- PayPal developer account
- OpenAI API key (optional, for full AI features)

## Step 1: Clone the Repository

```bash
git clone https://github.com/monkeymadness98/AetherCrown98.git
cd AetherCrown98
```

## Step 2: Setup Supabase Database

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon/public API key

2. **Run Database Schema**
   - Go to Supabase SQL Editor
   - Copy and paste the SQL from `DATABASE_SCHEMA.md`
   - Execute to create all tables and indexes

3. **Enable Real-time**
   - Go to Database → Replication
   - Enable real-time for: `ai_tasks`, `payments`, `ai_clones`, `activity_logs`

## Step 3: Configure Environment Variables

1. **Create .env file** (copy from .env.example):
```bash
cp .env.example .env
```

2. **Fill in the values**:
```env
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# PayPal (get from developer.paypal.com)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret

# OpenAI (optional, for AI agents)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Environment
NODE_ENV=development
```

## Step 4: Setup Frontend

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for production:
```bash
npm run build
npm start
```

## Step 5: Setup Backend

```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Open http://localhost:8000/docs for API documentation
```

### Test backend:
```bash
python3 test_startup.py
```

Expected output: All tests should pass ✓

## Step 6: Verify Setup

### Frontend Check
1. Open http://localhost:3000
2. Navigate to pages:
   - Home: `/`
   - Empire Console: `/empire`
   - Dashboard: `/dashboard`
   - Subscriptions: `/subscriptions`
   - Tasks: `/tasks`
   - Payments: `/payments`
   - Analytics: `/analytics`

### Backend Check
1. Open http://localhost:8000/docs
2. Test endpoints:
   - GET `/healthz` - Should return healthy status
   - GET `/metrics` - Should return system metrics
   - POST `/ai_agent` - Test AI agent delegation

### Database Check
1. Go to Supabase dashboard
2. Check tables exist:
   - users
   - ai_clones
   - ai_tasks
   - payments
   - activity_logs

## Step 7: Deploy to Production

### Deploy Backend to Render

1. **Push code to GitHub** (already done)

2. **Create Web Service on Render**:
   - Connect GitHub repository
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Add Environment Variables** in Render dashboard:
   ```
   SUPABASE_URL=your_url
   SUPABASE_KEY=your_key
   OPENAI_API_KEY=your_key
   PAYPAL_CLIENT_ID=your_id
   PAYPAL_CLIENT_SECRET=your_secret
   NODE_ENV=production
   LOG_LEVEL=INFO
   ```

4. **Note Backend URL**: `https://aethercrown98-backend.onrender.com`

### Deploy Frontend to Vercel

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Framework: Next.js (auto-detected)

2. **Add Environment Variables**:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   NEXT_PUBLIC_API_URL=https://aethercrown98-backend.onrender.com
   ```

3. **Deploy**: Vercel will auto-deploy
4. **Your site**: `https://aethercrown98.vercel.app`

## Step 8: Post-Deployment Testing

### Test Backend
```bash
curl https://aethercrown98-backend.onrender.com/healthz
```

Should return:
```json
{
  "status": "healthy",
  "services": {
    "api": {"status": "operational"},
    "database": {"status": "operational"}
  }
}
```

### Test Frontend
1. Visit https://aethercrown98.vercel.app
2. Check Empire Console for real-time data
3. Test payment creation in Subscriptions page
4. Verify real-time updates

## Troubleshooting

### Backend Won't Start
- **Check Python version**: Must be 3.11+
- **Check dependencies**: Run `pip install -r requirements.txt`
- **Check Supabase credentials**: Validate URL and key format
- **Run test**: `python3 test_startup.py`

### Frontend Won't Build
- **Clear cache**: `rm -rf .next node_modules && npm install`
- **Check Node version**: Must be 18+
- **Check TypeScript**: `npx tsc --noEmit`

### Database Connection Issues
- **Verify Supabase URL**: Should start with `https://`
- **Verify API Key**: Should start with `eyJ`
- **Check RLS policies**: May need to disable for testing
- **Check network**: Supabase may be blocked by firewall

### Real-time Not Working
- **Enable Real-time**: Database → Replication in Supabase
- **Check WebSocket**: Browser console for connection errors
- **CORS**: Ensure backend CORS allows frontend domain

## Features Overview

### Implemented Features ✅
- FastAPI backend with 13+ endpoints
- 4 AI agents (marketing, analytics, finance, reports)
- Scheduled daily reports at 09:00 UTC
- PayPal payment integration
- Real-time dashboard with Supabase subscriptions
- Empire Command Console with live KPIs
- Subscription plans with payment processing
- Complete API documentation
- Docker containerization
- Health checks and metrics
- Structured JSON logging

### Ready for Enhancement
- Google Analytics v4 integration
- Stripe payment fallback
- Recharts visualizations
- Email notifications
- Custom AI model training
- Advanced security (rate limiting, JWT)

## Support

For issues or questions:
1. Check documentation: README.md, DEPLOYMENT.md
2. Check backend API docs: http://localhost:8000/docs
3. Check logs:
   - Frontend: Browser console
   - Backend: Terminal output or Render logs
4. Open GitHub issue with details

## License

ISC

---

**Built with ❤️ by AetherCrown98 Team**
