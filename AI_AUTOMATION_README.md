# AI Automation Empire - Quick Setup

This directory contains the AI automation deployment setup for the AetherCrown98 business empire.

## 🚀 What's New

This implementation adds a complete AI automation infrastructure with:

1. **AI Automation API Server** (`server.js`)
   - Express-based REST API
   - AI processing endpoints
   - Health monitoring
   - CORS support

2. **AI Business Automation** (`ai-business-automation.js`)
   - Customer Service AI
   - Marketing AI
   - Operations AI
   - Task automation

3. **Deployment Configuration**
   - Render deployment for backend services
   - Vercel deployment for frontend
   - GitHub Actions CI/CD workflows
   - Environment variable management

4. **Monitoring & Debugging**
   - Deployment debugger script
   - Health check endpoints
   - Comprehensive logging

## 📦 Quick Start

### Install Dependencies
```bash
npm install
```

### Test AI Automation Server
```bash
npm run dev:server
```

Visit: http://localhost:3000

### Run Deployment Debugger
```bash
npm run debug
```

### Test All Services
```bash
npm test
```

### Build for Production
```bash
npm run build
```

## 🔧 API Endpoints

### Health Check
```bash
GET /health
```

Returns system health status and environment configuration.

### AI Processing
```bash
POST /api/ai-process
Content-Type: application/json

{
  "input": "Your request",
  "action": "process_type"
}
```

Processes AI requests and returns results.

## 📚 Documentation

- **[AI Deployment Guide](AI_DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Pre and post-deployment checklist
- **[Environment Variables](.env.example)** - Required environment variables

## 🧪 Testing

All services are fully tested:
- AI Business Automation tests (23 tests)
- Server API tests (19 tests)
- Backend tests (50 tests)

Total: **73 tests passing** ✅

## 🌐 Deployment Platforms

### Render (Backend Services)
- Python FastAPI Backend: `aethercrown98-backend`
- Node.js AI API: `ai-automation-api`

### Vercel (Frontend)
- Next.js Application: `aethercrown98`

## 📋 Environment Variables

Required for deployment:
```
NODE_ENV=production
OPENAI_API_KEY=your_key
DATABASE_URL=your_db
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
PAYPAL_CLIENT_ID=your_id
PAYPAL_CLIENT_SECRET=your_secret
```

See `.env.example` for complete list.

## 🔐 Security

- All secrets in environment variables
- CORS properly configured
- No hardcoded credentials
- SSL/HTTPS enforced in production

## 📊 Monitoring

- Health check: `/health`
- Render logs: Dashboard → Logs
- Vercel logs: Dashboard → Function Logs
- GitHub Actions: Actions tab

## 🆘 Troubleshooting

### Server won't start
```bash
npm run debug
```
This will check your environment configuration.

### Tests failing
```bash
npm install
npm test
```

### Build errors
```bash
npm run build
```
Check error messages and fix TypeScript/ESLint issues.

## 📖 Learn More

- [Express.js](https://expressjs.com/)
- [Next.js](https://nextjs.org/docs)
- [Render](https://render.com/docs)
- [Vercel](https://vercel.com/docs)

## 🎯 What's Included

### Files Added
- `server.js` - AI automation API server
- `ai-business-automation.js` - AI business logic
- `deployment-debug.js` - Deployment diagnostics
- `vercel.json` - Vercel configuration
- `.env.example` - Environment template
- `AI_DEPLOYMENT_GUIDE.md` - Deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Deployment checklist
- `.github/workflows/deploy-ai-business.yml` - CI/CD workflow

### Files Updated
- `package.json` - Added dependencies and scripts
- `render.yaml` - Added AI automation service
- `jest.config.js` - Support for JS tests

## ✅ Ready to Deploy!

Your AI automation empire is ready for deployment. Follow the [AI Deployment Guide](AI_DEPLOYMENT_GUIDE.md) for step-by-step instructions.
