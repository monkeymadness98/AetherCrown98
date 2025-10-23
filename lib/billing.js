/**
 * Billing Client Helper for AetherCrown98
 * 
 * This module provides helper functions for payment processing
 * with PayPal and Stripe on the frontend.
 */

/**
 * Create a payment intent with the backend
 * @param {Object} paymentData - Payment details
 * @param {number} paymentData.amount - Amount in cents
 * @param {string} paymentData.currency - Currency code (USD, EUR, etc.)
 * @param {string} paymentData.provider - Payment provider ('stripe' or 'paypal')
 * @param {string} paymentData.plan - Plan name ('starter', 'pro', 'enterprise')
 * @returns {Promise<Object>} Payment response with client secret
 */
export async function createPayment(paymentData) {
  try {
    const response = await fetch('/api/payments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error(`Payment creation failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
}

/**
 * Process Stripe payment
 * @param {string} clientSecret - Stripe client secret
 * @param {Object} stripe - Stripe.js instance
 * @param {Object} elements - Stripe Elements instance
 * @returns {Promise<Object>} Payment result
 */
export async function processStripePayment(clientSecret, stripe, elements) {
  try {
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, paymentIntent };
  } catch (error) {
    console.error('Stripe payment error:', error);
    throw error;
  }
}

/**
 * Initialize PayPal buttons
 * @param {string} containerId - DOM element ID for PayPal buttons
 * @param {Object} options - PayPal button options
 * @param {number} options.amount - Amount to charge
 * @param {string} options.plan - Plan name
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onError - Error callback
 */
export function initializePayPal(containerId, options) {
  if (typeof window === 'undefined' || !window.paypal) {
    console.error('PayPal SDK not loaded');
    return;
  }

  window.paypal.Buttons({
    createOrder: async function(data, actions) {
      try {
        const payment = await createPayment({
          amount: options.amount,
          currency: 'USD',
          provider: 'paypal',
          plan: options.plan,
        });

        return payment.order_id;
      } catch (error) {
        console.error('Error creating PayPal order:', error);
        if (options.onError) options.onError(error);
      }
    },
    onApprove: async function(data, actions) {
      try {
        const response = await fetch('/api/payments/capture', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order_id: data.orderID,
            provider: 'paypal',
          }),
        });

        const result = await response.json();
        
        if (options.onSuccess) {
          options.onSuccess(result);
        }

        return result;
      } catch (error) {
        console.error('Error capturing PayPal payment:', error);
        if (options.onError) options.onError(error);
      }
    },
    onError: function(error) {
      console.error('PayPal button error:', error);
      if (options.onError) options.onError(error);
    },
  }).render(`#${containerId}`);
}

/**
 * Get subscription status
 * @param {string} subscriptionId - Subscription ID
 * @returns {Promise<Object>} Subscription details
 */
export async function getSubscriptionStatus(subscriptionId) {
  try {
    const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch subscription: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
}

/**
 * Cancel subscription
 * @param {string} subscriptionId - Subscription ID
 * @returns {Promise<Object>} Cancellation result
 */
export async function cancelSubscription(subscriptionId) {
  try {
    const response = await fetch(`/api/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to cancel subscription: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

/**
 * Format amount for display
 * @param {number} amount - Amount in cents
 * @param {string} currency - Currency code
 * @returns {string} Formatted amount
 */
export function formatAmount(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100);
}

/**
 * Plan pricing configuration
 */
export const PLANS = {
  starter: {
    name: 'Starter',
    price: 0,
    currency: 'USD',
    features: [
      '1,000 API calls per month',
      'Basic analytics',
      'Email support',
      '1 GB storage',
    ],
  },
  pro: {
    name: 'Pro',
    price: 2900, // $29.00 in cents
    currency: 'USD',
    features: [
      '100,000 API calls per month',
      'Advanced analytics',
      'Priority support',
      '50 GB storage',
      'Team collaboration',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: null, // Custom pricing
    currency: 'USD',
    features: [
      'Unlimited API calls',
      'Dedicated account manager',
      '24/7 support',
      'Unlimited storage',
      'Custom integrations',
    ],
  },
};

export default {
  createPayment,
  processStripePayment,
  initializePayPal,
  getSubscriptionStatus,
  cancelSubscription,
  formatAmount,
  PLANS,
};
