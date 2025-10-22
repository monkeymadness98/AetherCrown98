# Quick Start Guide

## 🚀 Get AetherCrown98 Running in 5 Minutes

### Option 1: Docker Compose (Easiest)

```bash
# 1. Clone the repository
git clone https://github.com/monkeymadness98/AetherCrown98.git
cd AetherCrown98

# 2. Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials (at minimum, set SUPABASE_URL and SUPABASE_KEY)

# 3. Start everything
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# 4. Access the application
# Frontend: http://localhost:3001
# Backend API: http://localhost:3000/api
# Health check: http://localhost:3000/health
```

### Option 2: Local Development

```bash
# 1. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 2. Start backend
cd backend
cp .env.example .env
# Edit .env with your credentials
npm run dev

# 3. Start frontend (in new terminal)
cd frontend
npm run dev

# Access: http://localhost:3001
```

### Option 3: Kubernetes (Production)

```bash
# 1. Build and push images
docker build -t your-registry/aethercrown-backend:latest ./backend
docker push your-registry/aethercrown-backend:latest

docker build -t your-registry/aethercrown-frontend:latest ./frontend
docker push your-registry/aethercrown-frontend:latest

# 2. Update image references in Kubernetes manifests
# Edit infrastructure/kubernetes/*.yaml files

# 3. Deploy
kubectl apply -f infrastructure/kubernetes/

# 4. Verify
kubectl get pods
kubectl get services
```

## 📋 Prerequisites

### Required:
- **Node.js**: 18 or higher
- **Supabase Account**: For database (free tier available)
- **Stripe Account**: For payments (test mode available)

### Optional:
- **Docker**: For containerized deployment
- **Kubernetes**: For production deployment
- **OpenAI API Key**: For AI features (fallback available)

## 🔑 Environment Variables

### Minimum Required Configuration:

Create `backend/.env`:
```env
# Database (Required)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_supabase_anon_key

# Payments (Required for payment features)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# JWT (Required for authentication)
JWT_SECRET=your_random_secret_here
```

### Full Configuration:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_supabase_anon_key

# Payments
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# Authentication
JWT_SECRET=your_random_secret_here

# Redis (for caching)
REDIS_HOST=localhost
REDIS_PORT=6379

# AI Services (optional)
OPENAI_API_KEY=sk-xxxxx

# Blockchain (optional)
WEB3_PROVIDER_URL=http://localhost:8545
BLOCKCHAIN_ENABLED=false

# Security
API_KEY_ROTATION_DAYS=30
ENABLE_SECURITY_MONITORING=true
```

## 🗄️ Database Setup

### 1. Create Supabase Project
- Go to https://supabase.com
- Create new project
- Note your project URL and anon key

### 2. Run Database Schema
- Open Supabase SQL Editor
- Copy SQL from `docs/DATABASE.md`
- Execute to create tables and indexes

### 3. Configure Backend
- Update `SUPABASE_URL` in `.env`
- Update `SUPABASE_KEY` in `.env`

## ✅ Verification Steps

### 1. Check Backend Health
```bash
curl http://localhost:3000/health
# Expected: {"status":"healthy","timestamp":"..."}
```

### 2. Test API Endpoint
```bash
curl http://localhost:3000/api/payments/currencies
# Expected: JSON array of supported currencies
```

### 3. Access Frontend
- Open browser: http://localhost:3001
- You should see the dashboard

### 4. Check Logs
```bash
# Docker Compose
docker-compose -f infrastructure/docker/docker-compose.yml logs -f

# Local
# Check terminal where backend/frontend are running

# Kubernetes
kubectl logs -f deployment/aethercrown-backend
```

## 🎯 First Tasks

### 1. Test Dynamic Pricing
```bash
# Trigger price update
curl -X POST http://localhost:3000/api/pricing/update
```

### 2. View Dashboard
- Open http://localhost:3001
- View KPIs, charts, and analytics

### 3. Generate Marketing Content
```bash
curl -X POST http://localhost:3000/api/marketing/content/generate \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "test-product",
    "type": "ad-copy",
    "platform": "facebook"
  }'
```

### 4. Get Revenue Predictions
```bash
curl http://localhost:3000/api/revenue/predictions?timeframe=30d
```

## 🔧 Common Issues

### Port Already in Use
```bash
# Change port in backend/.env
PORT=3001

# Or stop existing service
lsof -ti:3000 | xargs kill
```

### Database Connection Failed
- Verify Supabase credentials
- Check internet connection
- Ensure database schema is created

### Docker Build Failed
```bash
# Clear Docker cache
docker system prune -a

# Rebuild
docker-compose -f infrastructure/docker/docker-compose.yml up --build
```

### Cannot Access Frontend
- Check if backend is running
- Verify NEXT_PUBLIC_API_URL in frontend
- Check browser console for errors

## 📚 Next Steps

1. **Explore API**: See `docs/API.md` for all endpoints
2. **Configure Features**: Enable optional features in `.env`
3. **Deploy**: Follow `docs/DEPLOYMENT.md` for production
4. **Customize**: Modify services in `backend/src/services/`
5. **Monitor**: Check logs and metrics

## 🆘 Getting Help

- **Documentation**: Check `/docs` folder
- **API Reference**: `docs/API.md`
- **Database Schema**: `docs/DATABASE.md`
- **Deployment**: `docs/DEPLOYMENT.md`
- **Issues**: Open on GitHub

## 🎉 You're Ready!

Your autonomous AI-driven business platform is now running. The system will:
- ✅ Update prices hourly
- ✅ Generate revenue predictions
- ✅ Monitor security
- ✅ Analyze competitors
- ✅ Auto-correct issues
- ✅ Update dependencies

Enjoy your self-maintaining business empire! 🚀
