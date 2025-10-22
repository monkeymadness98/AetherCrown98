import { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export default function Home() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleHealthCheck = async () => {
    setLoading(true);
    setStatus('Checking health...');
    try {
      const response = await axios.get(`${BACKEND_URL}/`);
      setStatus(`✅ Health Check: ${response.data.message}`);
      console.log('Health check response:', response.data);
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
      console.error('Health check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    setLoading(true);
    setStatus('Creating PayPal order...');
    try {
      const response = await axios.post(`${BACKEND_URL}/create-order`, {
        amount: '10.00',
        description: 'Test AetherCrown98 Purchase'
      });
      setStatus(`✅ Order Created! ID: ${response.data.orderID}`);
      setOrderDetails(response.data);
      console.log('Create order response:', response.data);
    } catch (error) {
      setStatus(`❌ Error: ${error.response?.data?.error || error.message}`);
      console.error('Create order error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCaptureOrder = async () => {
    if (!orderDetails?.orderID) {
      setStatus('❌ Please create an order first');
      return;
    }

    setLoading(true);
    setStatus('Capturing PayPal order...');
    try {
      const response = await axios.post(`${BACKEND_URL}/capture-order`, {
        orderID: orderDetails.orderID
      });
      setStatus(`✅ Order Captured! Capture ID: ${response.data.captureID}`);
      console.log('Capture order response:', response.data);
    } catch (error) {
      setStatus(`❌ Error: ${error.response?.data?.error || error.message}`);
      console.error('Capture order error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSupabaseTest = async () => {
    setLoading(true);
    setStatus('Testing Supabase connection...');
    try {
      const response = await axios.get(`${BACKEND_URL}/supabase-test`);
      setStatus(`✅ Supabase: ${response.data.message}`);
      console.log('Supabase test response:', response.data);
    } catch (error) {
      setStatus(`❌ Error: ${error.response?.data?.error || error.message}`);
      console.error('Supabase test error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🌟 AetherCrown98</h1>
        <p style={styles.subtitle}>Autonomous AI-driven business empire</p>

        <div style={styles.buttonGroup}>
          <button 
            onClick={handleHealthCheck} 
            disabled={loading}
            style={styles.button}
          >
            Health Check
          </button>

          <button 
            onClick={handleCreateOrder} 
            disabled={loading}
            style={styles.button}
          >
            Create PayPal Order
          </button>

          <button 
            onClick={handleCaptureOrder} 
            disabled={loading || !orderDetails}
            style={styles.button}
          >
            Capture PayPal Order
          </button>

          <button 
            onClick={handleSupabaseTest} 
            disabled={loading}
            style={styles.button}
          >
            Test Supabase
          </button>
        </div>

        {status && (
          <div style={styles.statusBox}>
            <p style={styles.statusText}>{status}</p>
          </div>
        )}

        {orderDetails && (
          <div style={styles.detailsBox}>
            <h3 style={styles.detailsTitle}>Order Details:</h3>
            <pre style={styles.pre}>{JSON.stringify(orderDetails, null, 2)}</pre>
          </div>
        )}

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Backend: <code style={styles.code}>{BACKEND_URL}</code>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '800px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '40px'
  },
  buttonGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '30px'
  },
  button: {
    padding: '15px 30px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
  },
  statusBox: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '2px solid #e9ecef'
  },
  statusText: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '500',
    color: '#333'
  },
  detailsBox: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '2px solid #e9ecef'
  },
  detailsTitle: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#333'
  },
  pre: {
    margin: 0,
    fontSize: '14px',
    overflow: 'auto',
    maxHeight: '300px',
    color: '#495057'
  },
  footer: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #e9ecef'
  },
  footerText: {
    margin: 0,
    fontSize: '14px',
    color: '#666',
    textAlign: 'center'
  },
  code: {
    backgroundColor: '#f8f9fa',
    padding: '4px 8px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#667eea'
  }
};
