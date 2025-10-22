require('dotenv').config();
const express = require('express');
const cors = require('cors');
const paypal = require('@paypal/checkout-server-sdk');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// PayPal environment setup
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    console.warn('PayPal credentials not configured');
    return null;
  }
  
  // Use sandbox for development
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  const env = environment();
  return env ? new paypal.core.PayPalHttpClient(env) : null;
}

// Supabase client setup
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
} else {
  console.warn('Supabase credentials not configured');
}

// Routes

// GET / - Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AetherCrown98 Backend API is running',
    version: '1.0.0',
    endpoints: {
      health: 'GET /',
      createOrder: 'POST /create-order',
      captureOrder: 'POST /capture-order',
      supabaseTest: 'GET /supabase-test'
    }
  });
});

// POST /create-order - Create a PayPal order
app.post('/create-order', async (req, res) => {
  try {
    const paypalClient = client();
    
    if (!paypalClient) {
      return res.status(503).json({
        success: false,
        error: 'PayPal service not configured'
      });
    }
    
    const { amount = '100.00', currency = 'USD' } = req.body;
    
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount
        }
      }]
    });
    
    const order = await paypalClient.execute(request);
    
    res.json({
      success: true,
      orderId: order.result.id,
      order: order.result
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order',
      message: error.message
    });
  }
});

// POST /capture-order - Capture a PayPal order
app.post('/capture-order', async (req, res) => {
  try {
    const paypalClient = client();
    
    if (!paypalClient) {
      return res.status(503).json({
        success: false,
        error: 'PayPal service not configured'
      });
    }
    
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: 'Order ID is required'
      });
    }
    
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    
    const capture = await paypalClient.execute(request);
    
    res.json({
      success: true,
      captureId: capture.result.id,
      capture: capture.result
    });
  } catch (error) {
    console.error('Error capturing order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to capture order',
      message: error.message
    });
  }
});

// GET /supabase-test - Test Supabase connection
app.get('/supabase-test', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(503).json({
        success: false,
        error: 'Supabase service not configured'
      });
    }
    
    // Simple test query - try to get service status
    const { data, error } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(1);
    
    if (error) {
      // Expected error if table doesn't exist, but connection works
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        return res.json({
          success: true,
          message: 'Supabase connection successful (test table not found, which is expected)',
          connected: true
        });
      }
      throw error;
    }
    
    res.json({
      success: true,
      message: 'Supabase connection successful',
      connected: true,
      data
    });
  } catch (error) {
    console.error('Error testing Supabase:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test Supabase connection',
      message: error.message
    });
  }
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AetherCrown98 Backend running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ PayPal configured: ${!!environment()}`);
  console.log(`✅ Supabase configured: ${!!supabase}`);
});
