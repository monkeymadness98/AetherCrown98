# AI Automation Deployment Guide

This guide provides step-by-step instructions for deploying the AetherCrown98 AI Automation Empire to Render and Vercel.

## Quick Start

### Prerequisites
- Node.js >= 18.0.0
- Python 3.12
- Git
- GitHub account
- Render account
- Vercel account

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/monkeymadness98/AetherCrown98.git
cd AetherCrown98

# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r backend/requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `OPENAI_API_KEY` - Your OpenAI API key
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase anonymous key
- `DATABASE_URL` - Your database connection string
- `PAYPAL_CLIENT_ID` - PayPal client ID (for payments)
- `PAYPAL_CLIENT_SECRET` - PayPal secret (for payments)

### 3. Test Locally

#### Test the AI Automation Server
```bash
npm run dev:server
```
Then visit: http://localhost:3000

Test the health endpoint:
```bash
curl http://localhost:3000/health
```

Test the AI processing endpoint:
```bash
curl -X POST http://localhost:3000/api/ai-process \
  -H "Content-Type: application/json" \
  -d '{"input": "Hello", "action": "greet"}'
```

#### Test the Next.js Frontend
```bash
npm run dev
```
Then visit: http://localhost:3000

#### Test the Python Backend
```bash
cd backend
uvicorn main:app --reload --port 8000
```
Then visit: http://localhost:8000/health

#### Run Deployment Debugger
```bash
npm run debug
```

This will check:
- Environment variables
- Node.js version
- Dependencies
- Network connectivity

### 4. Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linter
npm run lint

# Build the project
npm run build
```

## Deploying to Render

### Backend Deployment (Python FastAPI)

1. **Create Render Account**: Sign up at [render.com](https://render.com)

2. **Connect GitHub**: Connect your GitHub repository to Render

3. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your repository
   - Name: `aethercrown98-backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `gunicorn backend.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --timeout 120`

4. **Set Environment Variables** in Render Dashboard:
   - `PYTHON_VERSION=3.12.0`
   - `SUPABASE_URL=<your-supabase-url>`
   - `SUPABASE_KEY=<your-supabase-key>`
   - `OPENAI_API_KEY=<your-openai-key>`
   - `PAYPAL_CLIENT_ID=<your-paypal-id>`
   - `PAYPAL_SECRET=<your-paypal-secret>`

5. **Deploy**: Click "Create Web Service"

### AI Automation Service Deployment (Node.js)

1. **Create Another Web Service**:
   - Click "New +" → "Web Service"
   - Connect your repository
   - Name: `ai-automation-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm run start:server`

2. **Set Environment Variables** in Render Dashboard:
   - `NODE_ENV=production`
   - `OPENAI_API_KEY=<your-openai-key>`
   - `DATABASE_URL=<your-database-url>`
   - `PORT=10000`

3. **Configure Health Check**:
   - Path: `/health`

4. **Deploy**: Click "Create Web Service"

### Using render.yaml (Recommended)

Alternatively, you can use the included `render.yaml` for automatic deployment:

1. Go to Render Dashboard
2. Click "New +" → "Blueprint"
3. Connect your repository
4. Render will automatically detect `render.yaml` and create both services
5. Set environment variables for each service

## Deploying to Vercel

### Frontend Deployment (Next.js)

#### Method 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

#### Method 2: Using Vercel Dashboard

1. **Create Vercel Account**: Sign up at [vercel.com](https://vercel.com)

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Build Settings**:
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Set Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>`
   - `NEXT_PUBLIC_SUPABASE_KEY=<your-supabase-key>`
   - `SUPABASE_URL=<your-supabase-url>`
   - `SUPABASE_KEY=<your-supabase-key>`
   - `PAYPAL_CLIENT_ID=<your-paypal-id>`
   - `PAYPAL_CLIENT_SECRET=<your-paypal-secret>`
   - `NODE_ENV=production`

5. **Deploy**: Click "Deploy"

#### Method 3: GitHub Integration (Automatic)

1. Connect GitHub repository to Vercel
2. Push to `main` branch
3. Vercel automatically deploys

## GitHub Actions CI/CD

### Setup GitHub Secrets

1. Go to your repository on GitHub
2. Settings → Secrets and variables → Actions
3. Add the following secrets:

**Vercel Secrets:**
- `VERCEL_TOKEN` - Get from Vercel dashboard → Settings → Tokens
- `VERCEL_TEAM_ID` - Get from Vercel dashboard → Settings → General
- `VERCEL_PROJECT_ID` - Get from Vercel project settings

**Render Secrets:**
- `RENDER_API_KEY` - Get from Render dashboard → Account Settings → API Keys
- `RENDER_DEPLOY_HOOK_URL` - Get from Render service → Settings → Deploy Hook

**Application Secrets:**
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `OPENAI_API_KEY`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`

### Workflows Configured

The repository includes three GitHub Actions workflows:

1. **ci.yml** - Runs on all pushes and PRs
   - Linting
   - Testing
   - Building

2. **backend-test-and-deploy.yml** - Backend CI/CD
   - Frontend tests
   - Backend tests
   - Deploy to Render (on main branch)

3. **frontend-deploy.yml** - Frontend CI/CD
   - Build and test
   - Deploy to Vercel (on main branch)
   - Preview deployments (on PRs)

### Trigger Deployments

Push to main branch:
```bash
git add .
git commit -m "Deploy: Updated feature"
git push origin main
```

This will automatically:
1. Run CI checks
2. Deploy backend to Render
3. Deploy frontend to Vercel

## Monitoring Deployments

### Render
- View logs: Render Dashboard → Service → Logs
- Check health: `https://your-service.onrender.com/health`
- View metrics: Render Dashboard → Service → Metrics

### Vercel
- View deployments: Vercel Dashboard → Project → Deployments
- Check logs: Click on deployment → Function Logs
- View analytics: Vercel Dashboard → Analytics

### GitHub Actions
- View workflow runs: GitHub → Actions tab
- Check status badges in README
- Review logs for failed runs

## Testing Deployment

### Backend (Render)
```bash
# Test Python FastAPI backend
curl https://aethercrown98-backend.onrender.com/health
curl https://aethercrown98-backend.onrender.com/api/metrics

# Test Node.js AI service
curl https://ai-automation-api.onrender.com/health
curl -X POST https://ai-automation-api.onrender.com/api/ai-process \
  -H "Content-Type: application/json" \
  -d '{"input": "test", "action": "process"}'
```

### Frontend (Vercel)
Visit your Vercel URL: `https://aethercrown98.vercel.app`

## Troubleshooting

### Build Failures

**Node.js version mismatch:**
```bash
# Ensure package.json has:
"engines": {
  "node": ">=18.0.0"
}
```

**Missing dependencies:**
```bash
npm install
```

**TypeScript errors:**
```bash
npm run build
# Fix any TypeScript errors shown
```

### Runtime Errors

**Missing environment variables:**
- Check Render/Vercel dashboard
- Verify all required variables are set
- Re-deploy after adding variables

**Database connection errors:**
- Verify `DATABASE_URL` is correct
- Check database is accessible from deployment platform
- Review connection string format

**API errors:**
- Check API keys are valid
- Verify CORS settings
- Review application logs

### Deployment Failures

**Render deployment stuck:**
- Check build logs in Render dashboard
- Verify `render.yaml` syntax
- Ensure dependencies can be installed

**Vercel deployment failed:**
- Check build logs in Vercel dashboard
- Verify `vercel.json` configuration
- Ensure Next.js build succeeds locally

**GitHub Actions failed:**
- Review workflow logs
- Check GitHub secrets are set correctly
- Verify workflow YAML syntax

## Rolling Back

### Render
1. Go to service in Render dashboard
2. Click "Manual Deploy"
3. Select previous successful commit

### Vercel
1. Go to Deployments in Vercel dashboard
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

## Performance Optimization

### Frontend
- Enable Next.js ISR (Incremental Static Regeneration)
- Use Image Optimization
- Implement code splitting
- Configure caching headers

### Backend
- Increase Gunicorn workers for higher load
- Enable database connection pooling
- Implement Redis caching
- Use CDN for static assets

### Monitoring
- Set up Sentry for error tracking
- Use Render metrics
- Configure Vercel analytics
- Monitor API response times

## Costs

### Free Tier Limits

**Render:**
- 750 hours/month (sleeps after 15 min inactivity)
- 512 MB RAM
- Shared CPU

**Vercel:**
- 100 GB bandwidth/month
- 100 GB-hrs serverless function execution
- Unlimited deployments

### Upgrade Considerations
- High traffic → Upgrade Render to paid plan
- Long-running tasks → Consider Render background workers
- Large builds → Vercel Pro for increased limits

## Support

For issues:
1. Check deployment logs
2. Review this guide
3. Check GitHub Issues
4. Contact platform support

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [GitHub Actions](https://docs.github.com/en/actions)
