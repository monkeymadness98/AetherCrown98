const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const logger = require('../utils/logger');
const supabase = require('../utils/supabase');

class PaymentService {
  constructor() {
    this.supportedCurrencies = [
      { code: 'USD', symbol: '$', name: 'US Dollar' },
      { code: 'EUR', symbol: '€', name: 'Euro' },
      { code: 'GBP', symbol: '£', name: 'British Pound' },
      { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
      { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
      { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
      { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
      { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
    ];
  }

  /**
   * Create a one-time payment
   */
  async createPayment({ amount, currency, productId, userId }) {
    try {
      // Create payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: {
          productId,
          userId
        }
      });

      // Store payment record
      await supabase.from('payments').insert({
        user_id: userId,
        product_id: productId,
        amount,
        currency,
        stripe_payment_id: paymentIntent.id,
        status: 'pending',
        created_at: new Date()
      });

      logger.info(`Created payment for user ${userId}: ${amount} ${currency}`);

      return {
        clientSecret: paymentIntent.client_secret,
        paymentId: paymentIntent.id
      };
    } catch (error) {
      logger.error(`Error creating payment: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a subscription
   */
  async createSubscription({ userId, planId, currency }) {
    try {
      // Get plan details
      const { data: plan } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (!plan) {
        throw new Error('Subscription plan not found');
      }

      // Get or create Stripe customer
      let customerId = await this.getStripeCustomerId(userId);
      if (!customerId) {
        const customer = await stripe.customers.create({
          metadata: { userId }
        });
        customerId = customer.id;
        
        await supabase
          .from('users')
          .update({ stripe_customer_id: customerId })
          .eq('id', userId);
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: plan.stripe_price_id }],
        metadata: {
          userId,
          planId
        }
      });

      // Store subscription record
      await supabase.from('subscriptions').insert({
        user_id: userId,
        plan_id: planId,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000),
        current_period_end: new Date(subscription.current_period_end * 1000),
        created_at: new Date()
      });

      logger.info(`Created subscription for user ${userId}: ${planId}`);

      return {
        subscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      };
    } catch (error) {
      logger.error(`Error creating subscription: ${error.message}`);
      throw error;
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId) {
    try {
      // Get subscription from database
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('stripe_subscription_id', subscriptionId)
        .single();

      if (!subscription) {
        throw new Error('Subscription not found');
      }

      // Cancel in Stripe
      await stripe.subscriptions.cancel(subscriptionId);

      // Update database
      await supabase
        .from('subscriptions')
        .update({ 
          status: 'cancelled',
          cancelled_at: new Date()
        })
        .eq('stripe_subscription_id', subscriptionId);

      logger.info(`Cancelled subscription: ${subscriptionId}`);

      return { success: true, subscriptionId };
    } catch (error) {
      logger.error(`Error cancelling subscription: ${error.message}`);
      throw error;
    }
  }

  /**
   * Handle webhook events from Stripe
   */
  async handleWebhook(body, headers) {
    try {
      const event = body;

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;
        default:
          logger.info(`Unhandled webhook event type: ${event.type}`);
      }
    } catch (error) {
      logger.error(`Error handling webhook: ${error.message}`);
      throw error;
    }
  }

  /**
   * Handle successful payment
   */
  async handlePaymentSuccess(paymentIntent) {
    await supabase
      .from('payments')
      .update({ 
        status: 'succeeded',
        completed_at: new Date()
      })
      .eq('stripe_payment_id', paymentIntent.id);

    logger.info(`Payment succeeded: ${paymentIntent.id}`);
  }

  /**
   * Handle failed payment
   */
  async handlePaymentFailure(paymentIntent) {
    await supabase
      .from('payments')
      .update({ 
        status: 'failed',
        failed_at: new Date()
      })
      .eq('stripe_payment_id', paymentIntent.id);

    logger.info(`Payment failed: ${paymentIntent.id}`);
  }

  /**
   * Handle subscription update
   */
  async handleSubscriptionUpdate(subscription) {
    await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000),
        current_period_end: new Date(subscription.current_period_end * 1000)
      })
      .eq('stripe_subscription_id', subscription.id);

    logger.info(`Subscription updated: ${subscription.id}`);
  }

  /**
   * Handle subscription deletion
   */
  async handleSubscriptionDeleted(subscription) {
    await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date()
      })
      .eq('stripe_subscription_id', subscription.id);

    logger.info(`Subscription deleted: ${subscription.id}`);
  }

  /**
   * Get Stripe customer ID for a user
   */
  async getStripeCustomerId(userId) {
    const { data: user } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    return user?.stripe_customer_id;
  }

  /**
   * Get supported currencies
   */
  async getSupportedCurrencies() {
    return this.supportedCurrencies;
  }
}

module.exports = PaymentService;
