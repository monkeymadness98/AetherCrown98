"use client";

import { useState } from "react";
import { createPayment } from "@/lib/api";

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

export default function SubscriptionsPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const plans: Plan[] = [
    {
      id: "starter",
      name: "Starter",
      price: 99,
      interval: "month",
      features: [
        "5 AI Clones",
        "100 Tasks per month",
        "Basic Analytics",
        "Email Support",
        "API Access",
        "1 GB Storage"
      ],
      cta: "Start Free Trial"
    },
    {
      id: "professional",
      name: "Professional",
      price: 299,
      interval: "month",
      popular: true,
      features: [
        "25 AI Clones",
        "1,000 Tasks per month",
        "Advanced Analytics",
        "Priority Support",
        "Full API Access",
        "10 GB Storage",
        "Custom Integrations",
        "Real-time Monitoring"
      ],
      cta: "Get Started"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 999,
      interval: "month",
      features: [
        "Unlimited AI Clones",
        "Unlimited Tasks",
        "Custom AI Models",
        "24/7 Premium Support",
        "Dedicated Account Manager",
        "Unlimited Storage",
        "Advanced Security",
        "Custom Deployment",
        "SLA Guarantee",
        "White-label Options"
      ],
      cta: "Contact Sales"
    }
  ];

  const handleSubscribe = async (plan: Plan) => {
    setLoading(plan.id);
    setMessage(null);

    try {
      // Create payment for subscription
      const result = await createPayment(
        plan.price,
        'USD',
        `${plan.name} Plan - Monthly Subscription`
      );

      if (result.success) {
        const orderId = (result.data as any)?.order_id || 'N/A';
        setMessage({
          type: 'success',
          text: `Successfully created payment for ${plan.name} plan! Order ID: ${orderId}`
        });
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to create payment'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred'
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen py-12 animate-fade-in">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-text mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Scale your business with AI-powered automation. Choose the perfect plan for your needs.
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`max-w-2xl mx-auto mb-8 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-primary/20 border border-primary text-primary' 
              : 'bg-red-500/20 border border-red-500 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`card relative ${
                plan.popular ? 'glow-border scale-105' : ''
              } hover:transform hover:scale-105 transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-accent text-black text-xs font-bold px-4 py-2 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-5xl font-bold text-accent">${plan.price}</span>
                  <span className="text-gray-400 ml-2">/{plan.interval}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.id}
                className={`w-full ${
                  plan.popular ? 'btn-accent' : 'btn-primary'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.id ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  plan.cta
                )}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center gradient-text mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold text-accent mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-gray-400">
                Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-accent mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-400">
                We accept PayPal, credit cards (Visa, MasterCard, American Express), and Stripe payments.
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-accent mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-400">
                Yes! All plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-accent mb-2">
                What happens if I exceed my plan limits?
              </h3>
              <p className="text-gray-400">
                We'll notify you before you reach your limits. You can upgrade your plan or purchase additional resources as needed.
              </p>
            </div>
          </div>
        </div>

        {/* Enterprise CTA */}
        <div className="mt-16 text-center">
          <div className="card glow-border max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold gradient-text mb-4">
              Need a Custom Solution?
            </h2>
            <p className="text-gray-400 mb-6">
              Our Enterprise plan can be tailored to your specific needs. Contact our sales team for a personalized quote.
            </p>
            <button className="btn-accent px-8 py-3">
              Contact Sales Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
