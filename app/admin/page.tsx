'use client';

import { useState } from 'react';

interface Organization {
  id: string;
  name: string;
  subdomain: string;
  plan: string;
  users: number;
  revenue: number;
  status: string;
}

export default function AdminDashboard() {
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: '1',
      name: 'Acme Corp',
      subdomain: 'acme',
      plan: 'Enterprise',
      users: 150,
      revenue: 25000,
      status: 'active'
    },
    {
      id: '2',
      name: 'TechStart Inc',
      subdomain: 'techstart',
      plan: 'Pro',
      users: 45,
      revenue: 8500,
      status: 'active'
    },
    {
      id: '3',
      name: 'Digital Solutions',
      subdomain: 'digital',
      plan: 'Basic',
      users: 12,
      revenue: 1200,
      status: 'active'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const handleCreateOrganization = () => {
    setShowCreateModal(true);
  };

  const handleViewOrganization = (org: Organization) => {
    setSelectedOrg(org);
  };

  const totalUsers = organizations.reduce((sum, org) => sum + org.users, 0);
  const totalRevenue = organizations.reduce((sum, org) => sum + org.revenue, 0);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Multi-tenant organization management</p>
          </div>
          <button
            onClick={handleCreateOrganization}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
          >
            + Create Organization
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1A1A1A] border border-primary/20 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Organizations</p>
            <p className="text-3xl font-bold text-primary">{organizations.length}</p>
          </div>
          <div className="bg-[#1A1A1A] border border-primary/20 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Users</p>
            <p className="text-3xl font-bold text-accent">{totalUsers}</p>
          </div>
          <div className="bg-[#1A1A1A] border border-primary/20 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-primary">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-[#1A1A1A] border border-primary/20 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Active Organizations</p>
            <p className="text-3xl font-bold text-accent">
              {organizations.filter(o => o.status === 'active').length}
            </p>
          </div>
        </div>

        {/* Organizations Table */}
        <div className="bg-[#1A1A1A] border border-primary/20 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-primary/20">
            <h2 className="text-2xl font-semibold">Organizations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#121212]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Organization</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Subdomain</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Plan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Users</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Revenue</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {organizations.map((org) => (
                  <tr key={org.id} className="hover:bg-[#1F1F1F] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium">{org.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-primary text-sm">{org.subdomain}.aethercrown98.com</code>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        org.plan === 'Enterprise' ? 'bg-accent/20 text-accent' :
                        org.plan === 'Pro' ? 'bg-primary/20 text-primary' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {org.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{org.users}</td>
                    <td className="px-6 py-4 text-primary font-semibold">
                      ${org.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        org.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {org.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewOrganization(org)}
                        className="text-primary hover:text-primary-light text-sm font-medium"
                      >
                        Manage →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Organization Details Modal */}
        {selectedOrg && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1A1A1A] border border-primary/30 rounded-lg max-w-2xl w-full p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-primary">{selectedOrg.name}</h2>
                  <p className="text-gray-400 mt-1">{selectedOrg.subdomain}.aethercrown98.com</p>
                </div>
                <button
                  onClick={() => setSelectedOrg(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#121212] p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Plan</p>
                    <p className="text-xl font-semibold">{selectedOrg.plan}</p>
                  </div>
                  <div className="bg-[#121212] p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Users</p>
                    <p className="text-xl font-semibold">{selectedOrg.users}</p>
                  </div>
                  <div className="bg-[#121212] p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Revenue</p>
                    <p className="text-xl font-semibold text-primary">
                      ${selectedOrg.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-[#121212] p-4 rounded-lg">
                    <p className="text-gray-400 text-sm mb-1">Status</p>
                    <p className="text-xl font-semibold capitalize">{selectedOrg.status}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <h3 className="text-lg font-semibold mb-3">Management Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-primary transition-colors">
                      View Users
                    </button>
                    <button className="px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-primary transition-colors">
                      Billing
                    </button>
                    <button className="px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-primary transition-colors">
                      Settings
                    </button>
                    <button className="px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg text-primary transition-colors">
                      API Keys
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Organization Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1A1A1A] border border-primary/30 rounded-lg max-w-lg w-full p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary">Create Organization</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-[#121212] border border-gray-700 rounded-lg focus:border-primary focus:outline-none"
                    placeholder="Acme Corporation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Subdomain
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 bg-[#121212] border border-gray-700 rounded-l-lg focus:border-primary focus:outline-none"
                      placeholder="acme"
                    />
                    <span className="px-4 py-2 bg-[#0A0A0A] border border-l-0 border-gray-700 rounded-r-lg text-gray-400">
                      .aethercrown98.com
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Plan
                  </label>
                  <select className="w-full px-4 py-2 bg-[#121212] border border-gray-700 rounded-lg focus:border-primary focus:outline-none">
                    <option value="basic">Basic</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
