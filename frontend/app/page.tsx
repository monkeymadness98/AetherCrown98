'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Home() {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [captureResult, setCaptureResult] = useState<any>(null);
  const [supabaseResult, setSupabaseResult] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [orderId, setOrderId] = useState('');

  const testHealth = async () => {
    setLoading('health');
    try {
      const res = await fetch(`${API_URL}/`);
      const data = await res.json();
      setHealthStatus(data);
    } catch (error: any) {
      setHealthStatus({ error: error.message });
    } finally {
      setLoading(null);
    }
  };

  const createOrder = async () => {
    setLoading('create');
    try {
      const res = await fetch(`${API_URL}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: '100.00', currency: 'USD' })
      });
      const data = await res.json();
      setOrderResult(data);
      if (data.orderId) {
        setOrderId(data.orderId);
      }
    } catch (error: any) {
      setOrderResult({ error: error.message });
    } finally {
      setLoading(null);
    }
  };

  const captureOrder = async () => {
    if (!orderId) {
      setCaptureResult({ error: 'Please create an order first' });
      return;
    }
    setLoading('capture');
    try {
      const res = await fetch(`${API_URL}/capture-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      const data = await res.json();
      setCaptureResult(data);
    } catch (error: any) {
      setCaptureResult({ error: error.message });
    } finally {
      setLoading(null);
    }
  };

  const testSupabase = async () => {
    setLoading('supabase');
    try {
      const res = await fetch(`${API_URL}/supabase-test`);
      const data = await res.json();
      setSupabaseResult(data);
    } catch (error: any) {
      setSupabaseResult({ error: error.message });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          AetherCrown98
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Autonomous AI-driven business empire
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Health Check */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Health Check
            </h2>
            <button
              onClick={testHealth}
              disabled={loading === 'health'}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50"
            >
              {loading === 'health' ? 'Testing...' : 'Test Backend Connection'}
            </button>
            {healthStatus && (
              <pre className="mt-4 bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-auto max-h-48">
                {JSON.stringify(healthStatus, null, 2)}
              </pre>
            )}
          </div>

          {/* Create Order */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Create PayPal Order
            </h2>
            <button
              onClick={createOrder}
              disabled={loading === 'create'}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50"
            >
              {loading === 'create' ? 'Creating...' : 'Create Order ($100)'}
            </button>
            {orderResult && (
              <pre className="mt-4 bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-auto max-h-48">
                {JSON.stringify(orderResult, null, 2)}
              </pre>
            )}
          </div>

          {/* Capture Order */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Capture PayPal Order
            </h2>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Order ID"
              className="w-full mb-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={captureOrder}
              disabled={loading === 'capture'}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50"
            >
              {loading === 'capture' ? 'Capturing...' : 'Capture Order'}
            </button>
            {captureResult && (
              <pre className="mt-4 bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-auto max-h-48">
                {JSON.stringify(captureResult, null, 2)}
              </pre>
            )}
          </div>

          {/* Supabase Test */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Supabase Test
            </h2>
            <button
              onClick={testSupabase}
              disabled={loading === 'supabase'}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50"
            >
              {loading === 'supabase' ? 'Testing...' : 'Test Supabase'}
            </button>
            {supabaseResult && (
              <pre className="mt-4 bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-auto max-h-48">
                {JSON.stringify(supabaseResult, null, 2)}
              </pre>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            API Information
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>Backend URL:</strong> {API_URL}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            All endpoints are safely calling the backend without exposing any API keys.
            The backend handles all sensitive operations securely.
          </p>
        </div>
      </div>
    </div>
  );
}
