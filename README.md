# AetherCrown98

Autonomous AI-driven business empire - A full-stack application with Node.js/Express backend and Next.js frontend.

## 🏗️ Architecture

This repository contains:
- **Backend**: Node.js/Express API with PayPal and Supabase integrations
- **Frontend**: Next.js application with TypeScript and Tailwind CSS
- **CI/CD**: GitHub Actions workflows for automated deployment

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git
- PayPal Developer Account (for payment features)
- Supabase Account (for database features)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy the example environment file and configure it:
```bash
cp .env.example .env
```

4. Edit `.env` and add your credentials:
   - PayPal: Get from https://developer.paypal.com/dashboard/
   - Supabase: Get from https://app.supabase.com/project/_/settings/api

5. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Copy the example environment file:
```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` if needed (default points to `http://localhost:3001`)

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Backend API

- `GET /` - Health check and API information
- `POST /create-order` - Create a PayPal order
  - Body: `{ "amount": "100.00", "currency": "USD" }`
- `POST /capture-order` - Capture a PayPal order
  - Body: `{ "orderId": "ORDER_ID" }`
- `GET /supabase-test` - Test Supabase connection

## 🔒 Security

- All API keys and secrets are stored in environment variables
- Frontend only calls backend endpoints - no keys are exposed to the client
- `.env` files are gitignored to prevent accidental commits
- Use `.env.example` files as templates

## 🐳 Docker

Build and run the backend with Docker:

```bash
cd backend
docker build -t aethercrown98-backend .
docker run -p 3001:3001 --env-file .env aethercrown98-backend
```

## 📦 Deployment

### Backend Deployment Options

#### Option 1: Render
1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set the root directory to `backend`
4. Add environment variables in Render dashboard
5. Deploy!

Alternatively, use GitHub Actions:
- Add `RENDER_API_KEY` and `RENDER_SERVICE_ID` to GitHub Secrets
- Push to `main` branch to trigger deployment

#### Option 2: Fly.io
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `flyctl auth login`
3. Create app: `cd backend && flyctl launch`
4. Set secrets: `flyctl secrets set PAYPAL_CLIENT_ID=xxx PAYPAL_CLIENT_SECRET=xxx ...`
5. Deploy: `flyctl deploy`

Or use GitHub Actions:
- Add `FLY_API_TOKEN` to GitHub Secrets
- Push to `main` branch to trigger deployment

### Frontend Deployment (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `cd frontend && vercel`
4. Set environment variables in Vercel dashboard

Or use GitHub Actions:
- Add `VERCEL_TOKEN` and `NEXT_PUBLIC_API_URL` to GitHub Secrets
- Push to `main` branch to trigger deployment

## 🔧 Environment Variables

### Backend (.env)
```
PORT=3001
NODE_ENV=development
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### GitHub Secrets (for CI/CD)
- `RENDER_API_KEY` - Render API key
- `RENDER_SERVICE_ID` - Render service ID
- `FLY_API_TOKEN` - Fly.io API token
- `VERCEL_TOKEN` - Vercel token
- `NEXT_PUBLIC_API_URL` - Production backend URL

## 🛠️ Development

### Backend
```bash
cd backend
npm run dev  # Start with nodemon (auto-reload)
npm start    # Start production server
```

### Frontend
```bash
cd frontend
npm run dev    # Start development server
npm run build  # Build for production
npm start      # Start production server
```

## 📝 License

ISC

## 🤝 Contributing

This is an autonomous AI-driven project. AI agents can safely clone and interact with this repository as all sensitive credentials are managed through environment variables.
