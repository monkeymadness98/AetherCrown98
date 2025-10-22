"use client";

import { useState } from "react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("week");

  return (
    <div className="min-h-screen py-12 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Analytics</h1>
            <p className="text-gray-400">Track your business performance and insights</p>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex gap-2 mt-4 md:mt-0">
            {["day", "week", "month", "year"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeRange === range
                    ? "bg-accent text-black"
                    : "bg-background-card text-gray-400 hover:text-accent"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card-glow">
            <h3 className="text-gray-400 text-sm mb-2">Conversion Rate</h3>
            <p className="text-3xl font-bold text-accent mb-2">24.8%</p>
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 text-primary mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-primary">+3.2%</span>
            </div>
          </div>

          <div className="card-glow">
            <h3 className="text-gray-400 text-sm mb-2">Avg. Order Value</h3>
            <p className="text-3xl font-bold text-accent mb-2">$1,245</p>
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 text-primary mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-primary">+12.5%</span>
            </div>
          </div>

          <div className="card-glow">
            <h3 className="text-gray-400 text-sm mb-2">Customer Retention</h3>
            <p className="text-3xl font-bold text-accent mb-2">87.3%</p>
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 text-primary mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-primary">+5.1%</span>
            </div>
          </div>

          <div className="card-glow">
            <h3 className="text-gray-400 text-sm mb-2">Revenue Growth</h3>
            <p className="text-3xl font-bold text-accent mb-2">+34%</p>
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 text-primary mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-primary">+8.7%</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Revenue Chart */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-6 text-accent">Revenue Trend</h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {[65, 80, 75, 90, 85, 95, 88, 100].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-primary to-accent rounded-t-lg transition-all duration-1000 hover:opacity-80"
                    style={{
                      height: `${height}%`,
                      animationDelay: `${index * 100}ms`
                    }}
                  ></div>
                  <span className="text-xs text-gray-400 mt-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-6 text-accent">Traffic Sources</h3>
            <div className="space-y-4">
              {[
                { source: "Direct", percentage: 45, color: "primary" },
                { source: "Organic Search", percentage: 30, color: "accent" },
                { source: "Social Media", percentage: 15, color: "primary" },
                { source: "Referral", percentage: 10, color: "accent" },
              ].map((item, index) => (
                <div key={item.source}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">{item.source}</span>
                    <span className={`font-semibold ${item.color === "primary" ? "text-primary" : "text-accent"}`}>
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-background-dark rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        item.color === "primary"
                          ? "bg-gradient-to-r from-primary to-primary-light"
                          : "bg-gradient-to-r from-accent to-accent-light"
                      }`}
                      style={{
                        width: `${item.percentage}%`,
                        animationDelay: `${index * 200}ms`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Top Products */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-6 text-accent">Top Products</h3>
            <div className="space-y-4">
              {[
                { name: "AI Business Suite", sales: 234, revenue: "$293,500" },
                { name: "Analytics Pro", sales: 189, revenue: "$94,500" },
                { name: "Payment Gateway", sales: 156, revenue: "$46,800" },
              ].map((product, index) => (
                <div key={index} className="bg-background-dark/50 p-4 rounded-lg hover:bg-background-dark transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">{product.name}</h4>
                    <span className="text-accent font-bold">{product.revenue}</span>
                  </div>
                  <p className="text-sm text-gray-400">{product.sales} sales</p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Insights */}
          <div className="card glow-border">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center mr-3 animate-glow-pulse">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-accent">Customer Insights</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-background-dark/50 p-4 rounded-lg border-l-4 border-primary">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-primary">Peak Hours:</span> Most customers are active between 2-5 PM
                </p>
              </div>
              <div className="bg-background-dark/50 p-4 rounded-lg border-l-4 border-accent">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-accent">Demographics:</span> 65% of users are aged 25-40
                </p>
              </div>
              <div className="bg-background-dark/50 p-4 rounded-lg border-l-4 border-primary">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-primary">Behavior:</span> Average session duration: 8.5 minutes
                </p>
              </div>
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-6 text-accent">Top Regions</h3>
            <div className="space-y-4">
              {[
                { country: "United States", percentage: 42 },
                { country: "United Kingdom", percentage: 23 },
                { country: "Germany", percentage: 15 },
                { country: "Canada", percentage: 12 },
                { country: "Australia", percentage: 8 },
              ].map((region, index) => (
                <div key={region.country}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-300">{region.country}</span>
                    <span className="text-primary font-semibold">{region.percentage}%</span>
                  </div>
                  <div className="w-full bg-background-dark rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: `${region.percentage}%`,
                        animationDelay: `${index * 150}ms`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="card glow-border">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center mr-3 animate-glow-pulse">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-accent">AI-Powered Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background-dark/50 p-6 rounded-lg border border-primary/20">
              <h4 className="font-semibold text-primary mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Growth Opportunity
              </h4>
              <p className="text-gray-300 text-sm">
                Your conversion rate is 12% higher on mobile devices. Consider optimizing your mobile checkout experience to capitalize on this trend.
              </p>
            </div>
            <div className="bg-background-dark/50 p-6 rounded-lg border border-accent/20">
              <h4 className="font-semibold text-accent mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Timing Insight
              </h4>
              <p className="text-gray-300 text-sm">
                Email campaigns sent on Tuesday mornings have 28% higher open rates. Schedule your next campaign accordingly.
              </p>
            </div>
            <div className="bg-background-dark/50 p-6 rounded-lg border border-primary/20">
              <h4 className="font-semibold text-primary mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Revenue Optimization
              </h4>
              <p className="text-gray-300 text-sm">
                Customers who purchase "AI Business Suite" often buy "Analytics Pro" within 30 days. Create a bundle to increase average order value.
              </p>
            </div>
            <div className="bg-background-dark/50 p-6 rounded-lg border border-accent/20">
              <h4 className="font-semibold text-accent mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Retention Alert
              </h4>
              <p className="text-gray-300 text-sm">
                15% of customers haven't logged in for 30+ days. Launch a re-engagement campaign with personalized offers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
