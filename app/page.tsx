"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "AI Business Suite",
      description: "Complete automation for your business operations",
      price: "$999/mo",
      featured: true,
    },
    {
      id: 2,
      name: "Analytics Pro",
      description: "Advanced analytics and insights powered by AI",
      price: "$499/mo",
      featured: false,
    },
    {
      id: 3,
      name: "Payment Gateway",
      description: "Seamless payment processing with AI fraud detection",
      price: "$299/mo",
      featured: false,
    },
  ]);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-in">
              <span className="gradient-text">AetherCrown98</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Autonomous AI-Driven Business Empire
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Experience the future of business automation with cutting-edge AI technology.
              Streamline operations, maximize profits, and scale effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg">
                Start Free Trial
              </button>
              <button className="btn-accent text-lg">
                Watch Demo
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-float" style={{ animationDelay: "1s" }}></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background-dark/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
            Powered by Advanced AI
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-glow group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4 group-hover:animate-glow-pulse">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-accent">Lightning Fast</h3>
              <p className="text-gray-400">
                Process thousands of transactions per second with our optimized AI infrastructure.
              </p>
            </div>

            <div className="card-glow group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4 group-hover:animate-glow-pulse">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-accent">Secure & Private</h3>
              <p className="text-gray-400">
                Enterprise-grade security with end-to-end encryption and AI-powered fraud detection.
              </p>
            </div>

            <div className="card-glow group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mb-4 group-hover:animate-glow-pulse">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-accent">Smart Analytics</h3>
              <p className="text-gray-400">
                Real-time insights and predictive analytics to drive informed business decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Powered Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 gradient-text">
            AI-Recommended Products
          </h2>
          <p className="text-center text-gray-400 mb-12">
            Personalized recommendations based on your business needs
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className={`card ${product.featured ? "glow-border" : ""} group hover:transform hover:scale-105 transition-all duration-300`}
              >
                {product.featured && (
                  <div className="bg-accent text-black text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    RECOMMENDED
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-3 text-primary">{product.name}</h3>
                <p className="text-gray-400 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-accent">{product.price}</span>
                  <button className="btn-primary">
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using AetherCrown98 to automate and scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <button className="btn-primary text-lg px-8 py-4">
                Go to Dashboard
              </button>
            </Link>
            <Link href="/payments">
              <button className="btn-accent text-lg px-8 py-4">
                View Payments
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
