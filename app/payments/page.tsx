"use client";

import { useState } from "react";

export default function PaymentsPage() {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderStatus, setOrderStatus] = useState<"idle" | "processing" | "success" | "error">("idle");

  const handleCreateOrder = () => {
    setOrderStatus("processing");
    setTimeout(() => {
      setOrderStatus("success");
      setTimeout(() => setOrderStatus("idle"), 3000);
    }, 2000);
  };

  const handleCapturePayment = () => {
    setOrderStatus("processing");
    setTimeout(() => {
      setOrderStatus("success");
      setTimeout(() => setOrderStatus("idle"), 3000);
    }, 1500);
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
                {[
                  { id: 1, amount: "$1,250.00", date: "Oct 22, 2025", status: "Completed" },
                  { id: 2, amount: "$890.00", date: "Oct 21, 2025", status: "Completed" },
                  { id: 3, amount: "$2,100.00", date: "Oct 20, 2025", status: "Pending" },
                ].map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center p-3 bg-background-dark/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-white">{payment.amount}</p>
                      <p className="text-xs text-gray-400">{payment.date}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      payment.status === "Completed"
                        ? "bg-primary/20 text-primary"
                        : "bg-accent/20 text-accent"
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
