# AetherCrown98 Backend

Node.js Express API for the AetherCrown98 AI-driven business empire.

## 🚀 Features

- **Express.js API** - RESTful API server
- **Supabase Integration** - Database and authentication
- **PayPal Integration** - Payment processing with sandbox support
- **AI Clones Management** - CRUD operations for AI clones
- **Task Management** - AI task creation, monitoring, and execution
- **Logging System** - Comprehensive activity logging
- **Real-time Updates** - WebSocket support for live data

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev

# Start production server
npm start

# Run tests
npm test
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory with:

```env
SUPABASE_URL=https://your_supabase_project_url.supabase.co
SUPABASE_KEY=your_supabase_anon_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PORT=3000
NODE_ENV=development
```

## 📡 API Endpoints

### Health & Testing
- `GET /api/health` - Health check
- `GET /api/test-supabase` - Test Supabase connection

### AI Clones
- `GET /api/clones` - Get all clones
- `GET /api/clones/:id` - Get clone by ID
- `POST /api/clones` - Create new clone
- `PUT /api/clones/:id` - Update clone
- `DELETE /api/clones/:id` - Delete clone

### AI Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Payments
- `POST /api/payment/create-order` - Create PayPal order
- `POST /api/payment/capture-order` - Capture PayPal payment
- `GET /api/payments` - Get payment history

### Logging
- `GET /api/logs` - Get system logs (supports filtering)

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

## 🗄️ Database Schema

The backend expects the following Supabase tables:

### `users`
- `id` (UUID, primary key)
- `email` (text)
- `name` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### `clones`
- `id` (UUID, primary key)
- `name` (text)
- `type` (text)
- `capabilities` (jsonb)
- `status` (text)
- `created_at` (timestamp)

### `ai_tasks`
- `id` (UUID, primary key)
- `clone_id` (UUID, foreign key to clones)
- `task_type` (text)
- `status` (text)
- `input_data` (jsonb)
- `output_data` (jsonb)
- `error_message` (text)
- `created_at` (timestamp)

### `logs`
- `id` (UUID, primary key)
- `action_type` (text)
- `message` (text)
- `metadata` (jsonb)
- `timestamp` (timestamp)

### `payments`
- `id` (UUID, primary key)
- `order_id` (text)
- `amount` (numeric)
- `currency` (text)
- `status` (text)
- `created_at` (timestamp)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 🚢 Deployment

### Render

1. Connect your GitHub repository
2. Set root directory to `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables in Render dashboard

### Manual

```bash
# Build and start
npm install
npm start
```

## 📝 License

ISC
