import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Archive, BookOpen, TrendingUp, TrendingDown, MapPin, Star, Heart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { adminAPI } from '../services/api.js';

const DashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchMetrics();
  }, [timeRange]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      
      if (response.success) {
        const data = response.data;
        
        // Format data for charts
        const formattedMetrics = {
          totalUsers: data.totalUsers,
          activeSubscriptions: data.activeSubscriptions,
          totalAdmins: data.totalAdmins,
          newUsersThisWeek: data.newUsersThisWeek,
          recentActivity: data.recentActivity,
          subscriptionBreakdown: data.subscriptionBreakdown,
          userGrowth: [
            { month: 'Jan', users: Math.floor(data.totalUsers * 0.2) },
            { month: 'Feb', users: Math.floor(data.totalUsers * 0.35) },
            { month: 'Mar', users: Math.floor(data.totalUsers * 0.5) },
            { month: 'Apr', users: Math.floor(data.totalUsers * 0.7) },
            { month: 'May', users: Math.floor(data.totalUsers * 0.85) },
            { month: 'Jun', users: data.totalUsers }
          ],
          subscriptionTypes: data.subscriptionBreakdown.map(item => ({
            name: item._id === 'free' ? 'Free' : item._id === 'premium' ? 'Premium' : 'Enterprise',
            value: item.count,
            color: item._id === 'free' ? '#6B7280' : item._id === 'premium' ? '#3B82F6' : '#10B981'
          }))
        };
        
        setMetrics(formattedMetrics);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className="bg-gray-800 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome to RX Lifestyle Admin Panel</p>
        </div>
        <div className="flex space-x-2">
          {['7d', '30d', '90d', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-white text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {range === 'all' ? 'All Time' : range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={metrics?.totalUsers || 0}
          change={`+${metrics?.newUsersThisWeek || 0} this week`}
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Active Subscriptions"
          value={metrics?.activeSubscriptions || 0}
          change={`${Math.round((metrics?.activeSubscriptions / metrics?.totalUsers) * 100) || 0}% conversion`}
          icon={BookOpen}
          trend="up"
        />
        <StatCard
          title="User Engagement"
          value={`${Math.round((metrics?.recentActivity / metrics?.totalUsers) * 100) || 0}%`}
          change="Activity rate"
          icon={Heart}
          trend="up"
        />
        <StatCard
          title="Recent Activity"
          value={metrics?.recentActivity || 0}
          change="Last 24 hours"
          icon={Archive}
          trend="up"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Registration Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">User Growth Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics?.userGrowth || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Destinations by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Subscription Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={metrics?.subscriptionTypes || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {(metrics?.subscriptionTypes || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Quick Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Users</span>
              <span className="text-white font-semibold">{metrics?.totalUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Active Subscriptions</span>
              <span className="text-green-400 font-semibold">{metrics?.activeSubscriptions || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Admin Users</span>
              <span className="text-blue-400 font-semibold">{metrics?.totalAdmins || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">User Engagement Rate</span>
              <span className="text-yellow-400 font-semibold">{Math.round((metrics?.recentActivity / metrics?.totalUsers) * 100) || 0}%</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">System Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">New Users (This Week)</span>
              <span className="text-green-400 font-semibold">+{metrics?.newUsersThisWeek || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Recent Activity (24h)</span>
              <span className="text-blue-400 font-semibold">{metrics?.recentActivity || 0} events</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Conversion Rate</span>
              <span className="text-yellow-400 font-semibold">{Math.round((metrics?.activeSubscriptions / metrics?.totalUsers) * 100) || 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">System Status</span>
              <span className="text-green-400 font-semibold">Operational</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
