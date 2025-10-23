'use client';

import { useState } from 'react';

interface Campaign {
  id: string;
  name: string;
  platforms: string[];
  status: string;
  publishedAt: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    impressions: number;
  };
}

export default function MarketingDashboard() {
  const [campaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Weekly Update - Jan 20',
      platforms: ['Twitter', 'LinkedIn'],
      status: 'published',
      publishedAt: '2025-01-20',
      engagement: {
        likes: 342,
        shares: 89,
        comments: 45,
        impressions: 12450
      }
    },
    {
      id: '2',
      name: 'Revenue Milestone',
      platforms: ['Twitter', 'LinkedIn', 'Instagram'],
      status: 'published',
      publishedAt: '2025-01-18',
      engagement: {
        likes: 521,
        shares: 156,
        comments: 78,
        impressions: 18920
      }
    },
    {
      id: '3',
      name: 'Product Launch',
      platforms: ['Twitter', 'Instagram'],
      status: 'scheduled',
      publishedAt: '2025-01-25',
      engagement: {
        likes: 0,
        shares: 0,
        comments: 0,
        impressions: 0
      }
    }
  ]);

  const totalEngagement = campaigns.reduce((sum, c) => 
    sum + c.engagement.likes + c.engagement.shares + c.engagement.comments, 0
  );

  const totalImpressions = campaigns.reduce((sum, c) => 
    sum + c.engagement.impressions, 0
  );

  const getPlatformIcon = (platform: string) => {
    switch(platform.toLowerCase()) {
      case 'twitter': return '𝕏';
      case 'linkedin': return '💼';
      case 'instagram': return '📸';
      default: return '📱';
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Marketing Campaigns
            </h1>
            <p className="text-gray-400 mt-2">AI-powered social media automation and analytics</p>
          </div>
          <button className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
            + New Campaign
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1A1A1A] border border-primary/20 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Campaigns</p>
            <p className="text-3xl font-bold text-primary">{campaigns.length}</p>
            <p className="text-xs text-gray-500 mt-2">
              {campaigns.filter(c => c.status === 'published').length} published
            </p>
          </div>
          <div className="bg-[#1A1A1A] border border-primary/20 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Impressions</p>
            <p className="text-3xl font-bold text-accent">{totalImpressions.toLocaleString()}</p>
            <p className="text-xs text-green-400 mt-2">↑ 23.5% from last week</p>
          </div>
          <div className="bg-[#1A1A1A] border border-primary/20 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Engagement</p>
            <p className="text-3xl font-bold text-primary">{totalEngagement.toLocaleString()}</p>
            <p className="text-xs text-green-400 mt-2">↑ 18.2% from last week</p>
          </div>
          <div className="bg-[#1A1A1A] border border-primary/20 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Engagement Rate</p>
            <p className="text-3xl font-bold text-accent">
              {((totalEngagement / totalImpressions) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-green-400 mt-2">↑ 2.1% from last week</p>
          </div>
        </div>

        {/* Platform Performance */}
        <div className="bg-[#1A1A1A] border border-primary/20 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Platform Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#121212] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">𝕏</span>
                <span className="text-sm text-gray-400">Twitter</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Impressions</span>
                  <span className="text-primary font-semibold">15.2K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Engagement</span>
                  <span className="text-accent font-semibold">542</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Rate</span>
                  <span className="text-green-400 font-semibold">3.6%</span>
                </div>
              </div>
            </div>

            <div className="bg-[#121212] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">💼</span>
                <span className="text-sm text-gray-400">LinkedIn</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Impressions</span>
                  <span className="text-primary font-semibold">12.8K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Engagement</span>
                  <span className="text-accent font-semibold">489</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Rate</span>
                  <span className="text-green-400 font-semibold">3.8%</span>
                </div>
              </div>
            </div>

            <div className="bg-[#121212] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">📸</span>
                <span className="text-sm text-gray-400">Instagram</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Impressions</span>
                  <span className="text-primary font-semibold">8.4K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Engagement</span>
                  <span className="text-accent font-semibold">321</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Rate</span>
                  <span className="text-green-400 font-semibold">3.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-[#1A1A1A] border border-primary/20 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-primary/20">
            <h2 className="text-2xl font-semibold">Recent Campaigns</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="p-6 hover:bg-[#1F1F1F] transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{campaign.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      {campaign.platforms.map((platform, idx) => (
                        <span key={idx} className="text-xl" title={platform}>
                          {getPlatformIcon(platform)}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-400">
                      {campaign.status === 'published' ? 'Published' : 'Scheduled'}: {campaign.publishedAt}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    campaign.status === 'published' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {campaign.status}
                  </span>
                </div>

                {campaign.status === 'published' && (
                  <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-800">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Impressions</p>
                      <p className="text-lg font-semibold text-primary">
                        {campaign.engagement.impressions.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Likes</p>
                      <p className="text-lg font-semibold text-accent">
                        {campaign.engagement.likes}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Shares</p>
                      <p className="text-lg font-semibold text-primary">
                        {campaign.engagement.shares}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Comments</p>
                      <p className="text-lg font-semibold text-accent">
                        {campaign.engagement.comments}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="mt-8 bg-gradient-to-r from-[#1A1A1A] to-[#1F1F1F] border border-primary/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-accent mb-3">🤖 AI Marketing Insights</h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>LinkedIn posts generate 12% higher engagement than Twitter during business hours (9-5 EST)</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Posts with revenue metrics receive 45% more shares on average</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Optimal posting time: Tuesdays and Thursdays at 10 AM EST</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>Consider increasing Instagram presence - platform shows highest engagement rate</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
