# AetherCrown98

🚀 **Autonomous AI-Driven Business Empire**

A futuristic, high-end Next.js web application featuring a stunning **green and gold color scheme** with cutting-edge AI-powered business automation features.

## ✨ Features

### 🎨 Design & UI
- **Futuristic Color Scheme**: Rich green (#00A86B) and gold (#FFD700) with dark backgrounds
- **Modern Typography**: Clean, geometric fonts (Inter, Montserrat)
- **Smooth Animations**: Fade, slide, and glow effects on all interactive elements
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Gold Glow Effects**: Hover animations with neon-like gold highlights
- **Dark Mode by Default**: Sleek dark backgrounds with gradient effects

### 📊 Key Pages

#### Homepage
- Hero section with gradient text and floating elements
- AI-powered product recommendations
- Feature cards with hover glow effects
- Call-to-action buttons with green/gold styling

#### Empire Command Console
- Real-time KPI monitoring (Revenue, Tasks, Transactions, Uptime)
- Live system status dashboard
- AI-powered insights and recommendations
- Supabase real-time subscriptions
- Automatic metric refresh

#### Dashboard
- Real-time business metrics (Revenue, Transactions, Growth, Customers)
- Green/gold revenue charts with animations
- AI insights panel with border glow effects
- Recent transactions table

#### Subscriptions
- Three-tier pricing plans (Starter, Professional, Enterprise)
- Feature comparison
- Integrated payment creation
- FAQ section
- Custom enterprise solutions

#### Payments
- Futuristic payment form with multiple payment methods
- Order summary with detailed breakdown
- Secure payment indicators with green icons
- Recent payments history
- Processing animations

#### Analytics
- Key performance metrics with trend indicators
- Revenue trend visualization
- Traffic sources breakdown
- Top products, regions, and customer insights
- AI-powered recommendations panel

### 🤖 AI Integration

#### Frontend
- AI-driven personalization throughout the UI
- Real-time insights and recommendations
- Predictive analytics display
- Smart business suggestions
- Real-time data synchronization

#### Backend AI Agents
- **Marketing Agent**: Content generation, campaign analysis
- **Analytics Agent**: Data analysis, insight generation
- **Finance Agent**: Financial analysis, revenue projections
- **Reports Agent**: Comprehensive business reports
- Scheduled daily summaries at 09:00 UTC
- Background task processing with APScheduler
- OpenAI GPT-4 integration (ready for API key)

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (with custom green/gold theme)
- **UI**: Custom components with futuristic design
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Fonts**: Inter, Montserrat (from Google Fonts)

### Backend
- **Framework**: FastAPI (Python)
- **AI/ML**: OpenAI GPT-4 integration
- **Task Queue**: APScheduler for background jobs
- **Database**: Supabase Python SDK
- **Payments**: PayPal and Stripe integration
- **Logging**: Structured JSON logging

## 📦 Installation

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/monkeymadness98/AetherCrown98.git
cd AetherCrown98

# Install dependencies
npm install

# Configure environment variables
# Create .env file with:
# SUPABASE_URL=your_supabase_url
# SUPABASE_KEY=your_supabase_key
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
# Use the .env file in root directory or create backend/.env

# Run FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Open [http://localhost:8000/docs](http://localhost:8000/docs) to view the API documentation.

## 🚀 Build & Deploy

### Frontend (Vercel)

```bash
# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

**Vercel Deployment:**
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render)

```bash
# Build Docker image
cd backend
docker build -t aethercrown98-backend .

# Run container
docker run -p 8000:8000 --env-file ../.env aethercrown98-backend
```

**Render Deployment:**
1. Connect GitHub repository to Render
2. Use `backend/render.yaml` for configuration
3. Configure environment variables in Render dashboard
4. Deploy automatically on push to main branch

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🎯 Project Structure

```
AetherCrown98/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Homepage
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   ├── dashboard/           # Dashboard page
│   ├── empire/              # Empire Command Console
│   ├── subscriptions/       # Subscription plans
│   ├── payments/            # Payments page
│   ├── analytics/           # Analytics page
│   └── api/                 # Next.js API routes
├── backend/                 # FastAPI backend
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── database.py          # Supabase client
│   ├── agents/              # AI agent workers
│   │   └── worker.py        # Background task workers
│   ├── services/            # Business logic services
│   │   ├── payment_service.py
│   │   └── report_service.py
│   ├── utils/               # Utility functions
│   │   └── logging_config.py
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile           # Container configuration
│   └── render.yaml          # Render deployment config
├── components/              # Reusable components
│   ├── Header.tsx           # Navigation header
│   └── Footer.tsx           # Footer component
├── lib/                     # Shared utilities
│   ├── supabase.ts          # Supabase client
│   ├── api.ts               # API client
│   └── toast.tsx            # Toast notification system
├── public/                  # Static assets
├── tailwind.config.ts       # Tailwind configuration
├── next.config.mjs          # Next.js configuration
└── package.json             # Dependencies
```

## 🎨 Color Palette

- **Primary Green**: `#00A86B` (Rich emerald green)
- **Accent Gold**: `#FFD700` (Bright gold)
- **Background Dark**: `#0A0A0A` (Deep black)
- **Background Default**: `#121212` (Dark gray)
- **Card Background**: `#1A1A1A` (Slightly lighter gray)

## 🔧 Customization

### Modify Colors
Edit `tailwind.config.ts` to change the color scheme:

```typescript
colors: {
  primary: {
    DEFAULT: "#00A86B",  // Your custom green
    dark: "#008854",
    light: "#00C87F",
  },
  accent: {
    DEFAULT: "#FFD700",  // Your custom gold
    dark: "#E6C200",
    light: "#FFED4E",
  },
}
```

### Add New Components
Custom CSS classes are available in `app/globals.css`:
- `.btn-primary` - Green button with hover effects
- `.btn-accent` - Gold button with glow
- `.card` - Dark card with green border
- `.card-glow` - Card with hover glow effect
- `.gradient-text` - Green to gold gradient text
- `.glow-border` - Gold neon border effect

## 📱 Responsive Breakpoints

- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Sufficient color contrast ratios
- Keyboard navigation support
- Responsive font sizes

## 🔐 Security Features (UI Display)

- SSL encryption indicators
- AI-powered fraud detection badges
- PCI DSS compliance indicators
- Real-time transaction monitoring display

## 📄 License

ISC

## 👨‍💻 Author

**AetherCrown98 Team**

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
