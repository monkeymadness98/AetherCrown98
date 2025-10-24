"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Payment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  payment_method: string;
  created_at: string;
  completed_at?: string;
}

export default function PaymentsPage() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderStatus, setOrderStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currentOrderId, setCurrentOrderId] = useState<string>("");
  const [amount, setAmount] = useState("99.99");

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/payment');
      const data = await response.json();
      
      if (data.success) {
        setPayments(data.data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  useEffect(() => {
    // Fetch initial data - this is a common and valid pattern for data loading on mount
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial data fetch on component mount
    fetchPayments();

    // Subscribe to real-time updates
    const paymentsSubscription = supabase
      .channel('payments-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'payments' },
        (payload) => {
          console.log('Payment updated:', payload);
          fetchPayments();
        }
      )
      .subscribe();

    return () => {
      paymentsSubscription.unsubscribe();
    };
  }, []);

  const handleCreateOrder = async () => {
    setOrderStatus("processing");
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: 'USD',
          description: 'AetherCrown98 Payment'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setCurrentOrderId(data.order_id);
        setOrderStatus("success");
        fetchPayments();
        setTimeout(() => setOrderStatus("idle"), 3000);
      } else {
        setOrderStatus("error");
        setTimeout(() => setOrderStatus("idle"), 3000);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setOrderStatus("error");
      setTimeout(() => setOrderStatus("idle"), 3000);
    }
  };

  const handleCapturePayment = async () => {
    if (!currentOrderId) {
      alert('Please create an order first');
      return;
    }
    
    setOrderStatus("processing");
    try {
      const response = await fetch('/api/payment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: currentOrderId,
          status: 'completed'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setOrderStatus("success");
        fetchPayments();
        setTimeout(() => {
          setOrderStatus("idle");
          setCurrentOrderId("");
        }, 3000);
      } else {
        setOrderStatus("error");
        setTimeout(() => setOrderStatus("idle"), 3000);
      }
    } catch (error) {
      console.error('Error capturing payment:', error);
      setOrderStatus("error");
      setTimeout(() => setOrderStatus("idle"), 3000);
    }
  };

  return (
    <div className="min-h-screen py-12 animate-fade-in">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Payments</h1>
          <p className="text-gray-400">Manage your transactions and payment methods</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="card glow-border">
            <h2 className="text-2xl font-semibold mb-6 text-accent">Process Payment</h2>
            
            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-gray-400 mb-3">Payment Method</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === "card"
                      ? "border-accent bg-accent/10"
                      : "border-primary/20 hover:border-primary/50"
                  }`}
                >
                  <svg className="w-8 h-8 mx-auto mb-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-sm text-gray-300">Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod("crypto")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === "crypto"
                      ? "border-accent bg-accent/10"
                      : "border-primary/20 hover:border-primary/50"
                  }`}
                >
                  <svg className="w-8 h-8 mx-auto mb-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-300">Crypto</span>
                </button>
                <button
                  onClick={() => setPaymentMethod("bank")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === "bank"
                      ? "border-accent bg-accent/10"
                      : "border-primary/20 hover:border-primary/50"
                  }`}
                >
                  <svg className="w-8 h-8 mx-auto mb-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                  <span className="text-sm text-gray-300">Bank</span>
                </button>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-400 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input-futuristic w-full"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="input-futuristic w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="input-futuristic w-full"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="input-futuristic w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-accent font-bold">$</span>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="input-futuristic w-full pl-8"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCreateOrder}
                disabled={orderStatus === "processing"}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {orderStatus === "processing" ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : "Create Order"}
              </button>
              <button
                onClick={handleCapturePayment}
                disabled={orderStatus === "processing"}
                className="btn-accent w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {orderStatus === "processing" ? "Processing..." : "Capture Payment"}
              </button>
            </div>

            {/* Status Indicator */}
            {orderStatus === "success" && (
              <div className="mt-4 p-4 bg-primary/20 border border-primary rounded-lg animate-fade-in">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-primary font-semibold">Payment Successful!</span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Summary & Status */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 text-accent">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-primary/10">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white font-semibold">$1,299.00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-primary/10">
                  <span className="text-gray-400">Tax (10%)</span>
                  <span className="text-white font-semibold">$129.90</span>
                </div>
                <div className="flex justify-between py-2 border-b border-primary/10">
                  <span className="text-gray-400">Processing Fee</span>
                  <span className="text-white font-semibold">$29.00</span>
                </div>
                <div className="flex justify-between pt-4">
                  <span className="text-accent text-lg font-bold">Total</span>
                  <span className="text-accent text-2xl font-bold">$1,457.90</span>
                </div>
              </div>
            </div>

            {/* Payment Security */}
            <div className="card glow-border">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-primary">Secure Payment</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  256-bit SSL encryption
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  AI-powered fraud detection
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  PCI DSS compliant
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Real-time transaction monitoring
                </li>
              </ul>
            </div>

            {/* Recent Payments */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 text-accent">Recent Payments</h3>
              <div className="space-y-3">
                {payments.length === 0 ? (
                  <p className="text-center text-gray-400 py-4">No payment history yet</p>
                ) : (
                  payments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center p-3 bg-background-dark/50 rounded-lg">
                      <div>
                        <p className="font-semibold text-white">${payment.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">{new Date(payment.created_at).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{payment.order_id}</p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        payment.status === "completed"
                          ? "bg-primary/20 text-primary"
                          : payment.status === "created"
                          ? "bg-accent/20 text-accent"
                          : "bg-gray-400/20 text-gray-400"
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
