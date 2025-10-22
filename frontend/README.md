# AetherCrown98 Frontend

Next.js 16 frontend for the AetherCrown98 AI-driven business empire with futuristic green & gold theme.

## 🚀 Features

- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS v4** with custom green/gold theme
- **Supabase Integration** with real-time subscriptions
- **Real-time Updates** for tasks and clones
- **Responsive Design** for all devices
- **Futuristic UI** with animations and glow effects

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🔧 Environment Variables

Create a `.env.local` file in the frontend directory with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your_supabase_project_url.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

For production, update `NEXT_PUBLIC_API_URL` to your backend URL.

## 📄 Pages

### Public Pages
- `/` - Homepage with hero section and features
- `/login` - User login page
- `/signup` - User registration page

### Protected Pages
- `/dashboard` - Main dashboard with metrics and charts
- `/clones` - AI clones management
- `/tasks` - AI tasks monitoring and creation
- `/payments` - Payment processing and history
- `/analytics` - Business analytics and insights

## 🎨 Theme & Styling

### Color Palette
- **Primary Green**: `#00A86B`
- **Accent Gold**: `#FFD700`
- **Background Dark**: `#0A0A0A`
- **Card Background**: `#1A1A1A`

### Custom CSS Classes
Available in `app/globals.css`:
- `.btn-primary` - Green button with hover effects
- `.btn-accent` - Gold button with glow
- `.card` - Dark card with green border
- `.card-glow` - Card with hover glow effect
- `.gradient-text` - Green to gold gradient text
- `.glow-border` - Gold neon border effect
- `.animate-fade-in` - Fade in animation
- `.animate-slide-in` - Slide in animation
- `.animate-float` - Floating animation

## 🔌 API Integration

The frontend connects to the backend API using the utility in `lib/api.ts`:

```typescript
import { api } from '@/lib/api';

// Fetch clones
const clones = await api.getClones();

// Create task
await api.createTask({ clone_id, task_type, input_data });

// Create payment
await api.createPaymentOrder({ amount, currency, description });
```

## 🔄 Real-time Subscriptions

Real-time updates are implemented using Supabase subscriptions:

```typescript
const subscription = supabase
  .channel('tasks_channel')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'ai_tasks' }, () => {
    loadTasks();
  })
  .subscribe();
```

## 🧪 Development

```bash
# Start dev server
npm run dev

# Visit http://localhost:3000
```

## 🚢 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository
2. Set root directory to `frontend`
3. Framework preset: Next.js
4. Build command: `npm run build`
5. Add environment variables in Vercel dashboard

### Manual

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📱 Responsive Breakpoints

- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Sufficient color contrast ratios
- Keyboard navigation support
- Focus indicators on interactive elements

## 📝 License

ISC
