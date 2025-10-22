require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const paypal = require('@paypal/checkout-server-sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// PayPal client setup
function getPayPalClient() {
  const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  );
  return new paypal.core.PayPalHttpClient(environment);
}

// ============== ENDPOINTS ==============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AetherCrown98 Backend is running' });
});

// Test Supabase connection
app.get('/api/test-supabase', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ 
      success: true, 
      message: 'Supabase connected successfully',
      data: data 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============== AI CLONES ENDPOINTS ==============

// Get all clones
app.get('/api/clones', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clones')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching clones:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get clone by ID
app.get('/api/clones/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clones')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching clone:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new clone
app.post('/api/clones', async (req, res) => {
  try {
    const { name, type, capabilities, status } = req.body;

    const { data, error } = await supabase
      .from('clones')
      .insert([{ name, type, capabilities, status: status || 'active' }])
      .select();

    if (error) throw error;

    // Log the creation
    await logAction('clone_created', `Clone ${name} created`, { clone_id: data[0].id });

    res.status(201).json({ success: true, data: data[0] });
  } catch (error) {
    console.error('Error creating clone:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update clone
app.put('/api/clones/:id', async (req, res) => {
  try {
    const { name, type, capabilities, status } = req.body;

    const { data, error } = await supabase
      .from('clones')
      .update({ name, type, capabilities, status })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;

    // Log the update
    await logAction('clone_updated', `Clone ${req.params.id} updated`, { clone_id: req.params.id });

    res.json({ success: true, data: data[0] });
  } catch (error) {
    console.error('Error updating clone:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete clone
app.delete('/api/clones/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('clones')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    // Log the deletion
    await logAction('clone_deleted', `Clone ${req.params.id} deleted`, { clone_id: req.params.id });

    res.json({ success: true, message: 'Clone deleted successfully' });
  } catch (error) {
    console.error('Error deleting clone:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============== AI TASKS ENDPOINTS ==============

// Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ai_tasks')
      .select('*, clones(name)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get task by ID
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ai_tasks')
      .select('*, clones(name)')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { clone_id, task_type, input_data, status } = req.body;

    const { data, error } = await supabase
      .from('ai_tasks')
      .insert([{ 
        clone_id, 
        task_type, 
        input_data, 
        status: status || 'pending' 
      }])
      .select();

    if (error) throw error;

    // Log the creation
    await logAction('task_created', `Task ${task_type} created`, { 
      task_id: data[0].id, 
      clone_id 
    });

    res.status(201).json({ success: true, data: data[0] });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { status, output_data, error_message } = req.body;

    const { data, error } = await supabase
      .from('ai_tasks')
      .update({ status, output_data, error_message })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;

    // Log the update
    await logAction('task_updated', `Task ${req.params.id} status changed to ${status}`, { 
      task_id: req.params.id,
      status 
    });

    res.json({ success: true, data: data[0] });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('ai_tasks')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    // Log the deletion
    await logAction('task_deleted', `Task ${req.params.id} deleted`, { task_id: req.params.id });

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============== PAYMENT ENDPOINTS ==============

// Create PayPal order
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { amount, currency = 'USD', description } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount
        },
        description: description || 'AetherCrown98 Payment'
      }]
    });

    const paypalClient = getPayPalClient();
    const order = await paypalClient.execute(request);

    // Log the payment creation
    await logAction('payment_created', `Payment order created: ${order.result.id}`, {
      order_id: order.result.id,
      amount,
      currency
    });

    res.json({ 
      success: true, 
      orderId: order.result.id,
      data: order.result 
    });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Capture PayPal payment
app.post('/api/payment/capture-order', async (req, res) => {
  try {
    const { orderId } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const paypalClient = getPayPalClient();
    const capture = await paypalClient.execute(request);

    // Log the payment capture
    await logAction('payment_captured', `Payment captured: ${orderId}`, {
      order_id: orderId,
      status: capture.result.status
    });

    res.json({ 
      success: true, 
      data: capture.result 
    });
  } catch (error) {
    console.error('Error capturing PayPal payment:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get payment history
app.get('/api/payments', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============== LOGGING ENDPOINTS ==============

// Get logs
app.get('/api/logs', async (req, res) => {
  try {
    const { action_type, limit = 100 } = req.query;

    let query = supabase
      .from('logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    if (action_type) {
      query = query.eq('action_type', action_type);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create log entry (helper function used internally)
async function logAction(action_type, message, metadata = {}) {
  try {
    const { error } = await supabase
      .from('logs')
      .insert([{
        action_type,
        message,
        metadata,
        timestamp: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error logging action:', error);
    }
  } catch (error) {
    console.error('Error in logAction:', error);
  }
}

// ============== USER MANAGEMENT ==============

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, created_at, updated_at')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============== START SERVER ==============

app.listen(PORT, () => {
  console.log(`🚀 AetherCrown98 Backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Supabase URL: ${process.env.SUPABASE_URL}`);
});

module.exports = app; // For testing
