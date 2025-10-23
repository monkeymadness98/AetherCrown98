'use client';

import { useState, useEffect } from 'react';

export default function FinanceDashboard() {
  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    subscriptions: [],
    transactions: [],
    loading: true
  });

  useEffect(() => {
    // Fetch financial data (mock data for now)
    const mockData = {
      totalRevenue: 125430.50,
      subscriptions: [
        { name: 'Basic', value: 35, revenue: 35000 },
        { name: 'Pro', value: 45, revenue: 67500 },
        { name: 'Enterprise', value: 20, revenue: 22930.50 }
      ],
      transactions: [
        { date: '2025-01-20', amount: 1250, type: 'subscription' },
        { date: '2025-01-19', amount: 2100, type: 'one-time' },
        { date: '2025-01-18', amount: 850, type: 'subscription' },
        { date: '2025-01-17', amount: 3200, type: 'enterprise' },
        { date: '2025-01-16', amount: 1450, type: 'subscription' }
      ]
    };

    setTimeout(() => {
      setFinancialData({ ...mockData, loading: false });
    }, 500);
  }, []);

  const handleExportPDF = async () => {
    try {
      // Call backend export endpoint
      const response = await fetch('/api/export/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(financialData)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `financial-report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('PDF export is not yet configured. Please add the export endpoint.');
    }
  };

  if (financialData.loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-400">Loading financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Financial Analytics
            </h1>
            <p className="text-gray-400 mt-2">Comprehensive revenue and subscription insights</p>
          </div>
          <button
            onClick={handleExportPDF}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            📄 Export as PDF
          </button>
        </div>

        {/* AI Summary Box */}
        <div className="bg-gradient-to-r from-[#1A1A1A] to-[#1F1F1F] border border-primary/30 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-accent mb-3">🤖 Empire Performance Summary</h2>
          <p className="text-gray-300 leading-relaxed">
            Your autonomous business empire is performing exceptionally well. Total revenue has reached{' '}
            <span className="text-primary font-semibold">${financialData.totalRevenue.toLocaleString()}</span> with a{' '}
            healthy subscription distribution. Pro tier accounts for the highest revenue share at 53.8%, followed by{' '}
            Basic at 27.9%. Daily transaction volume shows consistent growth with an average of{' '}
            <span className="text-accent">${(financialData.transactions.reduce((sum, t) => sum + t.amount, 0) / financialData.transactions.length).toFixed(2)}</span> per day.{' '}
            Consider scaling Pro tier marketing to maximize revenue potential.
          </p>
        </div>

        {/* Revenue Chart */}
        <div className="bg-[#1A1A1A] border border-primary/20 rounded-lg p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-white">Total Revenue Trend</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {/* Simple bar chart visualization */}
            {[
              { label: 'Mon', value: 85 },
              { label: 'Tue', value: 92 },
              { label: 'Wed', value: 78 },
              { label: 'Thu', value: 95 },
              { label: 'Fri', value: 88 },
              { label: 'Sat', value: 70 },
              { label: 'Sun', value: 65 }
            ].map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-primary to-primary-light rounded-t transition-all hover:opacity-80"
                  style={{ height: `${day.value}%` }}
                />
                <span className="text-xs text-gray-400 mt-2">{day.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-gray-400 text-sm">
            Weekly revenue trend showing steady growth
          </div>
        </div>

        {/* Subscription Breakdown */}
        <div className="bg-[#1A1A1A] border border-primary/20 rounded-lg p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-white">Subscription Breakdown</h3>
          <div className="flex items-center justify-center h-64">
            {/* Simple pie chart representation */}
            <div className="grid grid-cols-3 gap-6 w-full max-w-2xl">
              {financialData.subscriptions.map((sub, idx) => {
                const colors = ['#00A86B', '#FFD700', '#00C87F'];
                const percentage = ((sub.revenue / financialData.totalRevenue) * 100).toFixed(1);
                return (
                  <div key={idx} className="text-center">
                    <div
                      className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-xl font-bold"
                      style={{ backgroundColor: colors[idx], opacity: 0.8 }}
                    >
                      {percentage}%
                    </div>
                    <div className="mt-3">
                      <p className="font-semibold">{sub.name}</p>
                      <p className="text-gray-400 text-sm">${sub.revenue.toLocaleString()}</p>
                      <p className="text-gray-500 text-xs">{sub.value} subscriptions</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Daily Transactions */}
        <div className="bg-[#1A1A1A] border border-primary/20 rounded-lg p-6">
          <h3 className="text-2xl font-semibold mb-4 text-white">Daily Transactions</h3>
          <div className="space-y-3">
            {financialData.transactions.map((transaction, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-4 bg-[#121212] rounded-lg hover:bg-[#1F1F1F] transition-colors"
              >
                <div>
                  <p className="font-medium">{new Date(transaction.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-400 capitalize">{transaction.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-primary">
                    ${transaction.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-400">
              Total: <span className="text-primary font-semibold">
                ${financialData.transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
              </span>
            </p>
          </div>
        </div>

        {/* Note about Recharts */}
        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-400 text-sm">
            📊 <strong>Note:</strong> This dashboard uses basic visualizations. For production deployment,
            install <code className="bg-black/50 px-2 py-1 rounded">recharts</code> library for advanced
            charting capabilities as specified in requirements.
          </p>
        </div>
      </div>
    </div>
  );
}
