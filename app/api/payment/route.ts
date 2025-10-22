import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// PayPal sandbox configuration
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';
const PAYPAL_API = process.env.NODE_ENV === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

// Helper function to get PayPal access token
async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  return data.access_token;
}

// POST: Create PayPal order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'USD', description = 'AetherCrown98 Payment' } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Valid amount is required'
      }, { status: 400 });
    }

    // For sandbox/testing, simulate PayPal order creation
    const orderId = `SANDBOX_ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store payment record in database
    const { data: paymentData, error: dbError } = await supabase
      .from('payments')
      .insert([{
        order_id: orderId,
        amount: parseFloat(amount),
        currency,
        status: 'created',
        description,
        payment_method: 'paypal',
        created_at: new Date().toISOString()
      }])
      .select();

    if (dbError) {
      return NextResponse.json({
        success: false,
        error: dbError.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      order_id: orderId,
      amount,
      currency,
      status: 'created',
      sandbox: true,
      message: 'PayPal sandbox order created successfully',
      data: paymentData?.[0]
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT: Capture/Complete PayPal payment
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, status = 'completed' } = body;

    if (!order_id) {
      return NextResponse.json({
        success: false,
        error: 'Order ID is required'
      }, { status: 400 });
    }

    // Update payment status in database
    const { data, error } = await supabase
      .from('payments')
      .update({
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('order_id', order_id)
      .select();

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Payment not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: data[0],
      message: `Payment ${status} successfully`,
      sandbox: true
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET: Fetch payment history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');
    const status = searchParams.get('status');

    let query = supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (orderId) {
      query = query.eq('order_id', orderId);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
