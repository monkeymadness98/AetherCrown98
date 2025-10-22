const paypal = require('@paypal/checkout-server-sdk');
require('dotenv').config();

/**
 * Set up and return PayPal SDK environment with PayPal HTTP client
 */
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  // Use SandboxEnvironment for testing
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

/**
 * Returns PayPal HTTP client instance with environment
 */
function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

module.exports = { client };
