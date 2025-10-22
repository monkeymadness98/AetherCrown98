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

#### Dashboard
- Real-time business metrics (Revenue, Transactions, Growth, Customers)
- Green/gold revenue charts with animations
- AI insights panel with border glow effects
- Recent transactions table

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
- AI-driven personalization throughout the UI
- Real-time insights and recommendations
- Predictive analytics display
- Smart business suggestions

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (with custom green/gold theme)
- **UI**: Custom components with futuristic design
- **Fonts**: Inter, Montserrat (from Google Fonts)

### Backend
- **Framework**: Express.js
- **Language**: JavaScript (Node.js)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Environment**: dotenv for configuration

### Integrations
- **Database**: Supabase
- **Payments**: PayPal (configured via environment variables)
- **Deployment**: Render, Vercel

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/monkeymadness98/AetherCrown98.git
cd AetherCrown98

# Copy environment variables
cp .env.example .env
# Edit .env with your actual credentials

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## 🚀 Running the Application

### Backend Server

```bash
cd backend

# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Backend runs on [http://localhost:3001](http://localhost:3001) by default.

### Frontend Application

```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Frontend runs on [http://localhost:3000](http://localhost:3000).

## 🎯 Project Structure

```
AetherCrown98/
├── backend/                  # Express backend server
│   ├── main.js              # Server entry point
│   ├── package.json         # Backend dependencies
│   └── node_modules/        # Backend packages
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js app directory
│   │   ├── page.tsx        # Homepage
│   │   ├── layout.tsx      # Root layout
│   │   ├── globals.css     # Global styles
│   │   ├── dashboard/      # Dashboard page
│   │   ├── payments/       # Payments page
│   │   └── analytics/      # Analytics page
│   ├── components/         # Reusable components
│   │   ├── Header.tsx      # Navigation header
│   │   └── Footer.tsx      # Footer component
│   ├── tailwind.config.ts  # Tailwind configuration
│   ├── next.config.mjs     # Next.js configuration
│   ├── package.json        # Frontend dependencies
│   └── node_modules/       # Frontend packages
├── .env                     # Environment variables (not in git)
├── .env.example             # Environment template
└── README.md                # This file
```

## 🔌 Backend API Endpoints

The backend server provides the following endpoints:

- **GET /health** - Health check endpoint
  - Returns: `{ status: 'ok', message: 'AetherCrown98 Backend is running', timestamp: '...' }`

- **GET /api** - API information
  - Returns: API version and available endpoints

- **GET /api/data** - Example Supabase data endpoint
  - Demonstrates Supabase integration
  - Returns data from configured Supabase table

All endpoints support CORS and are accessible from the frontend.

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Server Configuration
NODE_ENV=production
PORT=3000
```

See `.env.example` for a template.

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
