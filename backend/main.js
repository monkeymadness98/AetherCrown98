require('dotenv').config();
const express = require('express');
const cors = require('cors');
const paypal = require('@paypal/checkout-server-sdk');
const { client } = require('./paypalClient');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'AetherCrown98 Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Create PayPal order
app.post('/create-order', async (req, res) => {
  try {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: req.body.amount || '10.00'
        },
        description: req.body.description || 'AetherCrown98 Purchase'
      }]
    });

    const order = await client().execute(request);
    res.json({
      success: true,
      orderID: order.result.id,
      order: order.result
    });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create order'
    });
  }
});

// Capture PayPal order
app.post('/capture-order', async (req, res) => {
  try {
    const { orderID } = req.body;
    
    if (!orderID) {
      return res.status(400).json({
        success: false,
        error: 'orderID is required'
      });
    }

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await client().execute(request);
    res.json({
      success: true,
      captureID: capture.result.id,
      capture: capture.result
    });
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to capture order'
    });
  }
});

// Test Supabase connection
app.get('/supabase-test', async (req, res) => {
  try {
    // Test connection by attempting to query (will fail gracefully if no tables exist)
    const { data, error } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(1);
    
    // Connection is successful even if table doesn't exist
    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "relation does not exist" which is fine for testing
      throw error;
    }

    res.json({
      success: true,
      message: 'Supabase connection successful',
      supabaseUrl: process.env.SUPABASE_URL ? 'configured' : 'not configured',
      supabaseKey: process.env.SUPABASE_KEY ? 'configured' : 'not configured'
    });
  } catch (error) {
    console.error('Error testing Supabase:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to connect to Supabase',
      supabaseUrl: process.env.SUPABASE_URL ? 'configured' : 'not configured',
      supabaseKey: process.env.SUPABASE_KEY ? 'configured' : 'not configured'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
});
