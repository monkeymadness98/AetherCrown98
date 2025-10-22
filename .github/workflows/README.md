# GitHub Actions CI/CD Workflows

This directory contains automated CI/CD workflows for AetherCrown98.

## Workflows

### 1. Continuous Integration (`ci.yml`)
Runs on every push and pull request to ensure code quality.

**Triggers:**
- Push to `main`, `develop`, `feature/**`, `copilot/**` branches
- Pull requests to `main` and `develop`

**Jobs:**
- **Lint**: Runs ESLint to check code style
- **Test**: Runs Jest test suite with coverage
- **Build**: Builds Next.js application
- **Status Check**: Summarizes all CI results

### 2. Backend Test and Deploy (`backend-test-and-deploy.yml`)
Tests and deploys backend to Render.

**Triggers:**
- Push to `main` and `develop` branches
- Pull requests

**Jobs:**
- **Test**: Runs comprehensive backend tests
- **Deploy**: Deploys to Render (only on `main` branch)

### 3. Frontend Deploy (`frontend-deploy.yml`)
Builds and deploys frontend to Vercel.

**Triggers:**
- Push to `main` and `develop` branches
- Pull requests

**Jobs:**
- **Build and Test**: Builds Next.js and runs tests
- **Deploy to Vercel**: Production deployment (only on `main`)
- **Preview Deploy**: Creates preview deployment for PRs

## Required Secrets

Configure these secrets in your GitHub repository settings:

### Supabase
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anon/public key

### PayPal
- `PAYPAL_CLIENT_ID`: PayPal sandbox client ID
- `PAYPAL_CLIENT_SECRET`: PayPal sandbox client secret

### Render (Backend Deployment)
- `RENDER_API_KEY`: Render API key
- `RENDER_DEPLOY_HOOK_URL`: Render deploy hook URL (optional)

### Vercel (Frontend Deployment)
- `VERCEL_TOKEN`: Vercel authentication token
- `VERCEL_TEAM_ID`: Your Vercel team/organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID

## Setup Instructions

### 1. Configure Secrets
1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add all required secrets listed above

### 2. Get Vercel Credentials
```bash
# Install Vercel CLI
npm i -g vercel

# Link project and get credentials
vercel link
vercel project ls  # Get project ID
vercel teams ls    # Get team ID

# Generate token at https://vercel.com/account/tokens
```

### 3. Get Render API Key
1. Go to https://dashboard.render.com/
2. Navigate to Account Settings → API Keys
3. Create a new API key

### 4. Testing Workflows Locally
```bash
# Install act (GitHub Actions local runner)
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Run workflows locally
act push
act pull_request
```

## Deployment Flow

### Production Deployment (main branch)
```
Push to main
  ↓
Run CI (Lint, Test, Build)
  ↓
Deploy Backend to Render
  ↓
Deploy Frontend to Vercel
  ↓
Success Notification
```

### PR Preview Deployment
```
Create/Update PR
  ↓
Run CI (Lint, Test, Build)
  ↓
Create Vercel Preview
  ↓
Comment preview URL on PR
```

## Notifications

The workflows include console notifications for:
- ✅ Successful builds and deployments
- ❌ Failed tests or builds
- 🚀 Deployment status
- 🔗 Deployment URLs

To add Slack notifications, add this step to any job:
```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deployment completed!'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
  if: always()
```

## Preventing Failed Deployments

The workflows are configured to:
1. Block deployment if tests fail
2. Block deployment if build fails
3. Only deploy from `main` branch
4. Require all checks to pass before merge

## Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Ensure all dependencies are in `package.json`
- Review build logs in GitHub Actions tab

### Tests Fail
- Run tests locally: `npm test`
- Check if Supabase credentials are set
- Review test logs for specific failures

### Deployment Fails
- Verify deployment secrets are correct
- Check Render/Vercel dashboard for errors
- Ensure API keys have proper permissions

## Monitoring

- View workflow runs: Repository → Actions tab
- Check deployment status on Vercel/Render dashboards
- Review build artifacts in workflow run details
