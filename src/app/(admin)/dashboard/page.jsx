'use client';

import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, FileText, Eye, Clock,
  Download, MoreVertical, Filter, Calendar
} from 'lucide-react';

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  // Mock data
  const dashboardStats = {
    totalUsers: 1248,
    newUsers: 45,
    totalStories: 324,
    publishedStories: 298,
    totalViews: 124560,
    avgReadingTime: '4.2min',
    engagementRate: '68%',
    bounceRate: '32%',
  };

  // Performance metrics
  const performanceData = [
    { name: 'Jan', visitors: 4000, stories: 24, revenue: 2400 },
    { name: 'Feb', visitors: 3000, stories: 13, revenue: 1398 },
    { name: 'Mar', visitors: 2000, stories: 98, revenue: 9800 },
    { name: 'Apr', visitors: 2780, stories: 39, revenue: 3908 },
    { name: 'May', visitors: 1890, stories: 48, revenue: 4800 },
    { name: 'Jun', visitors: 2390, stories: 38, revenue: 3800 },
    { name: 'Jul', visitors: 3490, stories: 43, revenue: 4300 },
  ];

  // Top stories
  const topStories = [
    { id: 1, title: 'The Future of AI in Healthcare', author: 'Dr. Sarah Chen', views: 12450, likes: 890, comments: 156, status: 'Published', trend: 'up' },
    { id: 2, title: 'Sustainable Energy Solutions', author: 'Michael Torres', views: 9870, likes: 654, comments: 89, status: 'Published', trend: 'up' },
    { id: 3, title: 'Modern Web Development Trends', author: 'Alex Johnson', views: 8450, likes: 543, comments: 76, status: 'Published', trend: 'stable' },
    { id: 4, title: 'Mental Health in Tech Industry', author: 'Priya Sharma', views: 7560, likes: 432, comments: 65, status: 'Published', trend: 'down' },
    { id: 5, title: 'Blockchain Revolution', author: 'David Kim', views: 6540, likes: 321, comments: 54, status: 'Draft', trend: 'up' },
  ];

  // User activity
  const userActivity = [
    { time: '9:00 AM', users: 400, actions: 240 },
    { time: '12:00 PM', users: 300, actions: 139 },
    { time: '3:00 PM', users: 200, actions: 980 },
    { time: '6:00 PM', users: 278, actions: 390 },
    { time: '9:00 PM', users: 189, actions: 480 },
  ];

  // Categories distribution
  const categoryData = [
    { name: 'Technology', value: 35, color: '#3B82F6' },
    { name: 'Health', value: 25, color: '#10B981' },
    { name: 'Business', value: 20, color: '#8B5CF6' },
    { name: 'Lifestyle', value: 15, color: '#F59E0B' },
    { name: 'Education', value: 5, color: '#EF4444' },
  ];

  // Recent activities
  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'published a new story', target: 'AI Ethics Guide', time: '5 minutes ago', type: 'publish' },
    { id: 2, user: 'Sarah Smith', action: 'commented on', target: 'Web3 Trends', time: '1 hour ago', type: 'comment' },
    { id: 3, user: 'Mike Chen', action: 'registered as a new author', target: '', time: '2 hours ago', type: 'user' },
    { id: 4, user: 'Emma Wilson', action: 'updated profile information', target: '', time: '3 hours ago', type: 'update' },
    { id: 5, user: 'Admin', action: 'approved story submission', target: 'Sustainable Future', time: '5 hours ago', type: 'approve' },
  ];

  // Quick actions
  const quickActions = [
    { title: 'New Story', icon: '✍️', description: 'Create a new story', color: 'bg-blue-500', href: '/admin/stories/new' },
    { title: 'Analytics', icon: '📈', description: 'View detailed analytics', color: 'bg-green-500', href: '/admin/analytics' },
    { title: 'Users', icon: '👥', description: 'Manage users', color: 'bg-purple-500', href: '/admin/users' },
    { title: 'Settings', icon: '⚙️', description: 'System settings', color: 'bg-yellow-500', href: '/admin/settings' },
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">+{dashboardStats.newUsers} today</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published Stories</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.publishedStories.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600">Total: {dashboardStats.totalStories}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalViews.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">+12.5% this week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Reading Time</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.avgReadingTime}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Engagement: {dashboardStats.engagementRate}</span>
              <span className="text-red-600">Bounce: {dashboardStats.bounceRate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
              <p className="text-sm text-gray-600">Visitors, stories, and revenue trends</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="visitors" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="stories" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Content Categories</h3>
              <p className="text-sm text-gray-600">Distribution of stories by category</p>
            </div>
            <Filter className="w-5 h-5 text-gray-500" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Stories Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Top Performing Stories</h3>
                <p className="text-sm text-gray-600">Most viewed stories this month</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All →
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Story</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topStories.map((story) => (
                  <tr key={story.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{story.title}</div>
                        <div className="text-sm text-gray-500">by {story.author}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{story.views.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">❤️ {story.likes}</span>
                        <span className="text-blue-600">💬 {story.comments}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        story.status === 'Published' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {story.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <p className="text-sm text-gray-600">Latest actions on your platform</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                See All →
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'publish' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'comment' ? 'bg-green-100 text-green-600' :
                    activity.type === 'user' ? 'bg-purple-100 text-purple-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {activity.type === 'publish' ? '📝' :
                     activity.type === 'comment' ? '💬' :
                     activity.type === 'user' ? '👤' : '⚙️'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span>{' '}
                      {activity.action}{' '}
                      {activity.target && <span className="font-medium">{activity.target}</span>}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              className="group p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className={`${action.color} w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl`}>
                  {action.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* User Activity Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">User Activity Today</h3>
            <p className="text-sm text-gray-600">Real-time user engagement metrics</p>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Current Active Users: 124</span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="actions" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}