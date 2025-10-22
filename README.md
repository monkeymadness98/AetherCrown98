# AetherCrown98

> Autonomous AI-driven business empire - A full-stack application with PayPal and Supabase integration

## 🚀 Overview

AetherCrown98 is a full-stack web application built with:
- **Backend**: Node.js/Express with PayPal Sandbox and Supabase integration
- **Frontend**: Next.js with React
- **Deployment**: Automated CI/CD with GitHub Actions to Render/Fly.io (backend) and Vercel (frontend)
- **Containerization**: Docker support for easy deployment

## 📁 Project Structure

```
AetherCrown98/
├── backend/                 # Backend API server
│   ├── main.js             # Express server with endpoints
│   ├── paypalClient.js     # PayPal SDK configuration
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Environment variables template
├── frontend/               # Next.js frontend application
│   ├── pages/
│   │   └── index.js        # Main page with API integration
│   ├── package.json        # Frontend dependencies
│   ├── next.config.js      # Next.js configuration
│   └── .env.example        # Frontend environment variables
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions deployment workflow
├── Dockerfile              # Docker configuration for backend
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🔧 Backend API Endpoints

### `GET /`
Health check endpoint
- **Response**: `{ status: "healthy", message: "...", timestamp: "..." }`

### `POST /create-order`
Create a PayPal order in sandbox mode
- **Request Body**:
  ```json
  {
    "amount": "10.00",
    "description": "Purchase description"
  }
  ```
- **Response**: `{ success: true, orderID: "...", order: {...} }`

### `POST /capture-order`
Capture a PayPal order
- **Request Body**:
  ```json
  {
    "orderID": "order_id_from_create_order"
  }
  ```
- **Response**: `{ success: true, captureID: "...", capture: {...} }`

### `GET /supabase-test`
Test Supabase connection
- **Response**: `{ success: true, message: "...", supabaseUrl: "...", supabaseKey: "..." }`

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- PayPal Sandbox account ([developer.paypal.com](https://developer.paypal.com))
- Supabase account ([supabase.com](https://supabase.com))

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Fill in your environment variables in `.env`:
   ```env
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   PORT=3001
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

The backend will be available at `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file from the example:
   ```bash
   cp .env.example .env.local
   ```

4. Configure the backend URL in `.env.local`:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## 🐳 Docker Deployment

Build and run the backend container:

```bash
# Build the image
docker build -t aethercrown98-backend .

# Run the container
docker run -p 3001:3001 \
  -e PAYPAL_CLIENT_ID=your_id \
  -e PAYPAL_CLIENT_SECRET=your_secret \
  -e SUPABASE_URL=your_url \
  -e SUPABASE_KEY=your_key \
  aethercrown98-backend
```

## 🚢 Deployment with GitHub Actions

The project includes automated deployment via GitHub Actions:

### Required GitHub Secrets

Set these in your GitHub repository settings (Settings → Secrets and variables → Actions):

#### Backend Secrets:
- `PAYPAL_CLIENT_ID` - PayPal Sandbox Client ID
- `PAYPAL_CLIENT_SECRET` - PayPal Sandbox Client Secret
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase anon/public key
- `RENDER_API_KEY` - Render.com API key (optional)
- `FLY_API_TOKEN` - Fly.io API token (optional)

#### Frontend Secrets:
- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_TEAM_ID` - Vercel team ID (optional)
- `VERCEL_PROJECT_ID` - Vercel project ID
- `BACKEND_URL` - Your deployed backend URL

### Deployment Workflow

The workflow automatically:
1. Deploys backend to Render or Fly.io
2. Tests backend endpoints
3. Deploys frontend to Vercel
4. Runs integration tests on deployed endpoints

## 🔒 Security Notes

- **Never commit `.env` files** to the repository
- API keys and secrets are stored in GitHub Secrets
- PayPal integration uses Sandbox mode for testing
- AI clones only call backend endpoints; no API keys are exposed to the frontend

## 📝 Environment Variables Reference

### Backend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `PAYPAL_CLIENT_ID` | PayPal Sandbox Client ID | Yes |
| `PAYPAL_CLIENT_SECRET` | PayPal Sandbox Client Secret | Yes |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_KEY` | Supabase anon key | Yes |
| `RENDER_API_KEY` | Render API key for deployment | No |
| `PORT` | Server port (default: 3001) | No |

### Frontend (.env.local)
| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | Yes |
| `VERCEL_TOKEN` | Vercel deployment token | No |
| `VERCEL_TEAM_ID` | Vercel team ID | No |
| `NETLIFY_TEAM_ID` | Netlify team ID | No |

## 🧪 Testing

### Test Backend Locally
```bash
cd backend
npm start
curl http://localhost:3001/
```

### Test Frontend Locally
```bash
cd frontend
npm run dev
# Open http://localhost:3000 in your browser
```

## 📦 Dependencies

### Backend
- `express` - Web framework
- `@paypal/checkout-server-sdk` - PayPal SDK
- `@supabase/supabase-js` - Supabase client
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `axios` - HTTP client

### Frontend
- `next` - React framework
- `react` - UI library
- `react-dom` - React DOM renderer
- `axios` - HTTP client

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT

## 🔗 Useful Links

- [PayPal Developer](https://developer.paypal.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Fly.io Documentation](https://fly.io/docs)
