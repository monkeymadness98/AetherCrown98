const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// AI processing function placeholder
async function processAIRequest(input, action) {
  // Simulate AI processing
  return {
    input: input,
    action: action,
    result: `Processed ${action} for: ${input}`,
    timestamp: new Date().toISOString()
  };
}

// AI Agent endpoint
app.post('/api/ai-process', async (req, res) => {
  try {
    const { input, action } = req.body;
    
    if (!input || !action) {
      return res.status(400).json({
        success: false,
        error: 'Input and action are required'
      });
    }
    
    // Your AI processing logic here
    const result = await processAIRequest(input, action);
    
    res.json({ 
      success: true, 
      data: result,
      business: "AI Automation Empire"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'AI System Operational', 
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      hasDatabaseUrl: !!process.env.DATABASE_URL
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'AI Automation Empire',
    version: '1.0.0',
    endpoints: [
      { method: 'POST', path: '/api/ai-process', description: 'Process AI requests' },
      { method: 'GET', path: '/health', description: 'Health check' }
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: err.message 
  });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 AI Automation Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
