# AetherCrown98 - Quick Start Guide

Get up and running in 5 minutes! 🚀

## What You'll Get

- **AI-Powered Business Empire** with autonomous agents
- **Real-time Dashboard** showing revenue, tasks, and KPIs
- **Payment Processing** with PayPal integration
- **Background AI Workers** for automation
- **Beautiful UI** with green and gold theme

## Prerequisites

- Node.js 18+
- Python 3.11+
- Supabase account (free tier works)

## 1. Clone & Install (2 minutes)

```bash
# Clone repository
git clone https://github.com/monkeymadness98/AetherCrown98.git
cd AetherCrown98

# Install frontend
npm install

# Install backend
cd backend
pip install -r requirements.txt
cd ..
```

## 2. Setup Database (2 minutes)

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy your project URL and API key
3. Go to SQL Editor
4. Paste SQL from `DATABASE_SCHEMA.md` and run

### Enable Real-time
- Go to Database → Replication
- Enable for: `ai_tasks`, `payments`

## 3. Configure Environment (1 minute)

Create `.env` file:
```env
# Supabase (from step 2)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# PayPal (optional - use provided sandbox credentials for testing)
PAYPAL_CLIENT_ID=test
PAYPAL_CLIENT_SECRET=test

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Environment
NODE_ENV=development
```

## 4. Start Everything (30 seconds)

### Terminal 1 - Frontend:
```bash
npm run dev
```
Opens at: http://localhost:3000

### Terminal 2 - Backend:
```bash
cd backend
uvicorn main:app --reload
```
API Docs at: http://localhost:8000/docs

## 5. Explore! 🎉

### Visit These Pages:
- **Home**: http://localhost:3000 - Landing page
- **Empire Console**: http://localhost:3000/empire - Real-time command center
- **Dashboard**: http://localhost:3000/dashboard - Business metrics
- **Subscriptions**: http://localhost:3000/subscriptions - Pricing plans
- **Tasks**: http://localhost:3000/tasks - AI task management

### Test the API:
Go to http://localhost:8000/docs and try:
1. `GET /healthz` - Check system health
2. `GET /metrics` - View metrics
3. `POST /ai_agent` - Delegate to AI agent

## Common Issues

### "Cannot find module"
```bash
npm install
cd backend && pip install -r requirements.txt
```

### "Supabase error"
- Check your `.env` file has correct credentials
- Verify Supabase URL starts with `https://`
- Verify API key starts with `eyJ`

### "Port already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill

# Or use different port
npm run dev -- -p 3001
```

## What's Next?

### Optional Enhancements:
1. **Add OpenAI API Key** for full AI features:
   ```env
   OPENAI_API_KEY=sk-...
   ```

2. **Setup Real PayPal**:
   - Get credentials from developer.paypal.com
   - Add to `.env`

3. **Deploy to Production**:
   - Frontend: Vercel (free)
   - Backend: Render (free tier)
   - See `DEPLOYMENT.md` for details

## Features You Can Test

### AI Agents
```bash
curl -X POST http://localhost:8000/ai_agent \
  -H "Content-Type: application/json" \
  -d '{
    "agent_type": "analytics",
    "action": "analyze_data",
    "parameters": {}
  }'
```

### Create Payment
1. Go to http://localhost:3000/subscriptions
2. Click "Get Started" on any plan
3. Check http://localhost:3000/empire for real-time update

### View Metrics
```bash
curl http://localhost:8000/metrics
```

## Need Help?

- **Full Setup**: See `SETUP.md`
- **Deployment**: See `DEPLOYMENT.md`
- **API Docs**: http://localhost:8000/docs
- **Database Schema**: See `DATABASE_SCHEMA.md`

## Architecture

```
Frontend (Next.js)          Backend (FastAPI)
├── /empire                 ├── /healthz
├── /dashboard              ├── /metrics
├── /subscriptions          ├── /ai_agent
├── /tasks                  ├── /tasks/assign
├── /payments               ├── /payments/create
└── /analytics              └── /reports/generate
        ↓                           ↓
    Supabase PostgreSQL + Real-time
```

## What's Included

✅ 13+ API endpoints  
✅ 4 AI agents (marketing, analytics, finance, reports)  
✅ Real-time dashboard  
✅ Payment processing  
✅ Background task scheduler  
✅ Docker support  
✅ Complete documentation  
✅ Production-ready setup  

---

**Ready to build your AI empire!** 👑

For detailed documentation, see:
- `README.md` - Overview and features
- `SETUP.md` - Complete setup guide
- `DEPLOYMENT.md` - Production deployment
- `DATABASE_SCHEMA.md` - Database structure
