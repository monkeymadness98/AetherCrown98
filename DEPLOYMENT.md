# Deployment Guide

This guide covers deploying AetherCrown98 to various platforms.

## Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Deploy via GitHub

1. Push your code to GitHub (already done)
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure project:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Click "Deploy"

### Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

## Netlify

### Deploy via GitHub

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Choose GitHub and select your repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Click "Deploy site"

### Deploy via CLI

```bash
# Install Netlify CLI
npm install netlify-cli -g

# Login
netlify login

# Deploy
netlify deploy --prod
```

## Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]
```

### Build and Run

```bash
# Build image
docker build -t aethercrown98 .

# Run container
docker run -p 3000:3000 aethercrown98
```

## AWS Amplify

1. Go to AWS Amplify Console
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
5. Click "Save and deploy"

## Self-Hosted (VPS/Server)

### Prerequisites
- Node.js 20+ installed
- PM2 for process management

### Setup

```bash
# Clone repository
git clone https://github.com/monkeymadness98/AetherCrown98.git
cd AetherCrown98

# Install dependencies
npm install

# Build application
npm run build

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "aethercrown98" -- start

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

Create a `.env.local` file for environment-specific configuration:

```env
# Supabase Configuration (Required)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=your-supabase-anon-key

# PayPal Configuration (Required for payments)
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret

# Vercel Deployment (Required for Vercel CI/CD)
VERCEL_TOKEN=your-vercel-token
VERCEL_PROJECT_ID=your-vercel-project-id
VERCEL_TEAM_ID=your-vercel-team-id

# Render Deployment (Required for Render CI/CD)
RENDER_API_KEY=your-render-api-key
RENDER_DEPLOY_HOOK_URL=https://api.render.com/deploy/your-service-id

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Feature Flags (Optional)
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
```

**Note**: Never commit `.env.local` to version control. It's already in `.gitignore`.

### GitHub Secrets Configuration

For CI/CD workflows to function properly, configure the following secrets in your GitHub repository:

**Settings > Secrets and variables > Actions > New repository secret**

**Required Secrets:**
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anonymous key
- `PAYPAL_CLIENT_ID`: PayPal REST API client ID
- `PAYPAL_CLIENT_SECRET`: PayPal REST API client secret

**For Vercel Deployment:**
- `VERCEL_TOKEN`: Vercel deployment token (get from Vercel account settings)
- `VERCEL_PROJECT_ID`: Your Vercel project ID (found in project settings)
- `VERCEL_TEAM_ID`: Your Vercel team ID (found in team settings)

**For Render Deployment:**
- `RENDER_API_KEY`: Render API key (get from Render account settings)
- `RENDER_DEPLOY_HOOK_URL`: Render deploy hook URL (found in service settings)

**Optional Secrets:**
- `SLACK_WEBHOOK`: For Slack notifications (if configured)

## Performance Optimization

### For Production Deployment:

1. **Enable Compression**: Most platforms enable this by default
2. **CDN Setup**: Use Vercel Edge Network or CloudFlare
3. **Image Optimization**: Next.js handles this automatically
4. **Caching**: Configure proper cache headers

### Monitoring

Consider adding:
- **Vercel Analytics**: Built-in performance monitoring
- **Google Analytics**: User behavior tracking
- **Sentry**: Error tracking
- **LogRocket**: Session replay

## Domain Configuration

### Custom Domain on Vercel

1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Configure DNS:
   - A Record: `76.76.21.21`
   - CNAME: `cname.vercel-dns.com`

### SSL/HTTPS

All recommended platforms (Vercel, Netlify, Amplify) provide free SSL certificates automatically.

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm test
      # Add deployment step based on your platform
```

## Troubleshooting

### Build Fails
- Check Node.js version (requires 20+)
- Clear cache: `rm -rf .next node_modules && npm install`
- Verify all dependencies are installed

### Runtime Errors
- Check environment variables
- Review server logs
- Ensure all API endpoints are accessible

### Performance Issues
- Enable static generation where possible
- Use Next.js Image optimization
- Implement proper caching strategies

## Support

For deployment issues:
- Next.js Documentation: https://nextjs.org/docs
- Vercel Support: https://vercel.com/support
- GitHub Issues: https://github.com/monkeymadness98/AetherCrown98/issues
