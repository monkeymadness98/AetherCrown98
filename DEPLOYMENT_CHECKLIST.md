# AI Business Deployment Checklist

## Pre-Deployment

### Environment Configuration
- [ ] Set `NODE_ENV=production` in deployment environment
- [ ] Configure `OPENAI_API_KEY` (required for AI features)
- [ ] Configure `DATABASE_URL` (required for data persistence)
- [ ] Configure `SUPABASE_URL` and `SUPABASE_KEY`
- [ ] Configure `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` for payments
- [ ] Set appropriate `PORT` (default: 3000 for Node.js, 8000 for Python)

### Code Quality
- [ ] All dependencies properly listed in `package.json`
- [ ] All Python dependencies listed in `backend/requirements.txt`
- [ ] Build scripts tested locally (`npm run build`)
- [ ] Tests passing (`npm test`)
- [ ] Linting passing (`npm run lint`)

### Security
- [ ] API keys secured in environment variables (never in code)
- [ ] `.env` file added to `.gitignore`
- [ ] Secrets properly configured in platform settings
- [ ] CORS configured appropriately for production domains

## Platform Specific

### Render (Backend Services)

#### Python FastAPI Backend
- [x] `render.yaml` configured for Python service
- [x] `backend/requirements.txt` includes all dependencies
- [x] Build command: `pip install -r backend/requirements.txt`
- [x] Start command: `gunicorn backend.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --timeout 120`
- [x] Health check endpoint at `/health`
- [ ] Environment variables configured in Render dashboard

#### Node.js AI Automation Service
- [x] `render.yaml` configured for Node.js service
- [x] Build command: `npm install`
- [x] Start command: `npm run start:server`
- [x] Health check endpoint at `/health`
- [ ] Environment variables configured in Render dashboard

### Vercel (Frontend)
- [x] `vercel.json` configured
- [x] Next.js configuration optimized
- [x] API routes properly structured under `/app/api`
- [x] Function timeouts adjusted (30s default)
- [ ] Environment variables configured in Vercel dashboard
- [ ] Domain configured (optional)

## GitHub Actions (CI/CD)

### Workflows Configured
- [x] `ci.yml` - Continuous Integration (lint, test, build)
- [x] `backend-test-and-deploy.yml` - Backend testing and deployment
- [x] `frontend-deploy.yml` - Frontend deployment to Vercel

### Secrets Required in GitHub
- [ ] `VERCEL_TOKEN` - Vercel deployment token
- [ ] `VERCEL_TEAM_ID` - Vercel team/org ID
- [ ] `VERCEL_PROJECT_ID` - Vercel project ID
- [ ] `RENDER_API_KEY` - Render API key
- [ ] `RENDER_DEPLOY_HOOK_URL` - Render deploy hook (optional)
- [ ] `SUPABASE_URL` - Supabase project URL
- [ ] `SUPABASE_KEY` - Supabase anon key
- [ ] `PAYPAL_CLIENT_ID` - PayPal client ID
- [ ] `PAYPAL_CLIENT_SECRET` - PayPal secret

## Testing

### Local Testing
```bash
# Test AI Automation Server
npm run dev:server

# Test deployment debugger
npm run debug

# Test Next.js frontend
npm run dev

# Run all tests
npm test

# Build for production
npm run build
```

### Backend Testing
```bash
# Test Python backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Test endpoints
curl http://localhost:8000/health
curl http://localhost:8000/api/metrics
```

## Post-Deployment

### Verification
- [ ] Frontend accessible at production URL
- [ ] Backend API responding at production URL
- [ ] Health check endpoints returning OK status
- [ ] AI automation service responding correctly
- [ ] All API endpoints functional
- [ ] Payment processing working (if applicable)

### Monitoring
- [ ] Check Render logs for backend errors
- [ ] Check Vercel logs for frontend errors
- [ ] Monitor GitHub Actions for CI/CD status
- [ ] Set up error tracking (Sentry, etc.) - optional
- [ ] Configure uptime monitoring - optional

### Performance
- [ ] Frontend loads quickly (<3s)
- [ ] API responses are fast (<1s)
- [ ] Database queries optimized
- [ ] Caching configured where appropriate

### Security
- [ ] SSL/HTTPS active on all domains
- [ ] Environment variables not exposed in client code
- [ ] API rate limiting configured (if applicable)
- [ ] CORS restricted to production domains only

### Backup & Recovery
- [ ] Database backup strategy in place
- [ ] Environment variables documented securely
- [ ] Deployment rollback plan documented
- [ ] Incident response plan ready

## Deployment Commands

### Deploy to Vercel
```bash
# Install Vercel CLI (if needed)
npm i -g vercel

# Deploy to production
npx vercel --prod
```

### Deploy to Render
```bash
# Trigger deployment via git push
git push origin main

# Or use deploy hook
curl -X POST $RENDER_DEPLOY_HOOK_URL
```

### Manual Deployment
```bash
# Clone repository
git clone https://github.com/monkeymadness98/AetherCrown98.git
cd AetherCrown98

# Install dependencies
npm install

# Test locally
npm run dev:server

# Deploy
git push origin main
```

## Troubleshooting

### Common Issues

#### Build Failures
- Check Node.js version (>=18.0.0 required)
- Verify all dependencies installed
- Check for TypeScript errors
- Review build logs

#### Runtime Errors
- Verify environment variables are set
- Check API keys are valid
- Review application logs
- Test database connectivity

#### Deployment Failures
- Confirm platform credentials are correct
- Check GitHub secrets configuration
- Review workflow logs
- Verify render.yaml and vercel.json syntax

### Support Resources
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

## Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Review and rotate API keys quarterly
- [ ] Check for security vulnerabilities
- [ ] Monitor error rates and performance
- [ ] Review and optimize costs

### Updates
- [ ] Keep Next.js updated
- [ ] Keep FastAPI and dependencies updated
- [ ] Update Node.js LTS version as needed
- [ ] Update Python version as needed
