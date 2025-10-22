import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import apiService from '../services/api';

const Dashboard = () => {
  const { t } = useTranslation();
  const [kpis, setKpis] = useState(null);
  const [traffic, setTraffic] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [kpisData, trafficData, revenueData] = await Promise.all([
        apiService.getDashboardKPIs('30d'),
        apiService.getTrafficAnalytics('30d'),
        apiService.getRevenuePredictions('30d')
      ]);

      setKpis(kpisData);
      setTraffic(trafficData);
      setRevenue(revenueData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">{t('dashboard')}</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">${kpis?.revenue?.total?.toLocaleString()}</p>
          <p className="text-green-600 text-sm mt-2">
            +{kpis?.revenue?.growth?.toFixed(1)}% from last period
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
          <p className="text-3xl font-bold mt-2">{kpis?.orders?.total?.toLocaleString()}</p>
          <p className="text-gray-600 text-sm mt-2">
            Avg: ${kpis?.orders?.avgValue?.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Conversion Rate</h3>
          <p className="text-3xl font-bold mt-2">{kpis?.conversions?.rate}%</p>
          <p className="text-gray-600 text-sm mt-2">
            {kpis?.conversions?.total} conversions
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">New Users</h3>
          <p className="text-3xl font-bold mt-2">{kpis?.users?.new?.toLocaleString()}</p>
          <p className="text-gray-600 text-sm mt-2">
            Last {kpis?.timeframe}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Predictions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Revenue Predictions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenue?.predictions?.slice(0, 30) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="predicted_revenue" stroke="#8884d8" name="Predicted Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic Analytics */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Daily Traffic</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={traffic?.daily?.slice(0, 30) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#82ca9d" name="Page Views" />
              <Bar dataKey="uniqueVisitors" fill="#8884d8" name="Unique Visitors" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Page</th>
                <th className="text-right py-2">Views</th>
              </tr>
            </thead>
            <tbody>
              {traffic?.topPages?.map((page, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{page.page}</td>
                  <td className="text-right py-2">{page.views.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Revenue Forecast Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Total Predicted (30d)</p>
            <p className="text-2xl font-bold">${revenue?.summary?.totalPredicted?.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Avg Daily Revenue</p>
            <p className="text-2xl font-bold">${revenue?.summary?.avgDailyRevenue?.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Trend</p>
            <p className="text-2xl font-bold capitalize">{revenue?.summary?.trend}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
