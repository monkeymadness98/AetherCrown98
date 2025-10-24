"use client";

import { useState, useMemo } from "react";

export default function DashboardPage() {
  const [stats] = useState({
    revenue: "$124,500",
    transactions: "1,234",
    growth: "+23%",
    customers: "456",
  });

  const [recentTransactions] = useState([
    { id: 1, date: "2025-10-22", amount: "$1,250", status: "completed", customer: "John Doe" },
    { id: 2, date: "2025-10-22", amount: "$890", status: "completed", customer: "Jane Smith" },
    { id: 3, date: "2025-10-21", amount: "$2,100", status: "pending", customer: "Acme Corp" },
    { id: 4, date: "2025-10-21", amount: "$650", status: "completed", customer: "Bob Johnson" },
  ]);

  // Generate consistent random values for chart percentages
  const chartData = useMemo(() => {
    const seed = 42; // Use a seed for consistent values
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => ({
      month,
      percentage: 20 + (index * 15) + (index * 1.5), // Use deterministic calculation
      revenue: Math.round(1000 + index * 500)
    }));
  }, []);

  return (
    <div className="min-h-screen py-12 animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here&apos;s your business overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card-glow group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">Total Revenue</h3>
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-accent mb-2">{stats.revenue}</p>
            <p className="text-sm text-primary">↑ {stats.growth} from last month</p>
          </div>

          <div className="card-glow group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">Transactions</h3>
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{stats.transactions}</p>
            <p className="text-sm text-gray-400">This month</p>
          </div>

          <div className="card-glow group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">Growth Rate</h3>
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-primary mb-2">{stats.growth}</p>
            <p className="text-sm text-gray-400">Month over month</p>
          </div>

          <div className="card-glow group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-sm font-medium">Active Customers</h3>
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-2">{stats.customers}</p>
            <p className="text-sm text-gray-400">Total customers</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Revenue Chart */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-6 text-accent">Revenue Overview</h3>
            <div className="space-y-4">
              {chartData.map((data, index) => (
                <div key={data.month}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">{data.month}</span>
                    <span className="text-primary font-semibold">${data.revenue}</span>
                  </div>
                  <div className="w-full bg-background-dark rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-1000 animate-slide-in"
                      style={{ width: `${data.percentage}%`, animationDelay: `${index * 100}ms` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="card glow-border">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center mr-3 animate-glow-pulse">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-accent">AI Insights</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-background-dark/50 p-4 rounded-lg border-l-4 border-primary">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-primary">Revenue Spike Detected:</span> Your revenue is up 23% this month. Consider scaling your marketing efforts.
                </p>
              </div>
              <div className="bg-background-dark/50 p-4 rounded-lg border-l-4 border-accent">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-accent">Optimization Tip:</span> Based on transaction patterns, Wednesday afternoons show the highest conversion rates.
                </p>
              </div>
              <div className="bg-background-dark/50 p-4 rounded-lg border-l-4 border-primary">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-primary">Forecast:</span> AI predicts a 15% increase in transactions next month based on current trends.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-6 text-accent">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/20">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-primary/10 hover:bg-background-dark/50 transition-colors">
                    <td className="py-4 px-4 text-gray-300">{transaction.date}</td>
                    <td className="py-4 px-4 text-gray-300">{transaction.customer}</td>
                    <td className="py-4 px-4 text-accent font-semibold">{transaction.amount}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        transaction.status === "completed"
                          ? "bg-primary/20 text-primary"
                          : "bg-accent/20 text-accent"
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
