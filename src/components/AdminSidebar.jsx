'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';

export default function AdminSidebar({ sidebarOpen, currentPath, user }) {
  const [expandedItems, setExpandedItems] = useState(['dashboard']);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleItem = useCallback((item) => {
    setExpandedItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }, []);

  // Helper function to check if parent is active
  const isParentActive = useCallback((item) => {
    if (currentPath === item.href) return true;
    if (item.children?.some(child => currentPath === child.href)) return true;
    return false;
  }, [currentPath]);

  // Navigation items
  const navItems = useMemo(() => [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      href: '/dashboard',
      children: null
    },
    {
      id: 'stories',
      label: 'Stories',
      icon: '📚',
      href: null,
      children: [
        { label: 'All Stories', href: '/stories' },
        { label: 'Add New Story', href: '/addStoey' },
        { label: 'Drafts', href: '/admin/stories/drafts' },
        { label: 'Published', href: '/admin/stories/published' },
      ]
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: '🏷️',
      href: null,
      children: [
        { label: 'All Categories', href: '/allcategory' },
        { label: 'Add Category', href: '/addCategory' },
      ]
    },
    {
      id: 'SubCategories',
      label: 'Sub Category',
      icon: '🏷️',
      href: null,
      children: [
        { label: 'All Sub-Category', href: '/allsubCategory' },
        { label: 'Add Sub-Category', href: '/subcategory' },
      ]
    },
    {
      id: 'users',
      label: 'Users',
      icon: '👥',
      href: null,
      children: [
        { label: 'All Users', href: '/admin/users' },
        { label: 'Add User', href: '/admin/users/new' },
        { label: 'User Roles', href: '/admin/users/roles' },
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      href: '/admin/analytics',
      children: null
    },
    {
      id: 'content',
      label: 'Content',
      icon: '📝',
      href: null,
      children: [
        { label: 'Comments', href: '/admin/content/comments' },
        { label: 'Reviews', href: '/admin/content/reviews' },
      ]
    },
  ], []);

  // Mock stats for dashboard preview
  const stats = useMemo(() => ({
    stories: { total: 156, today: 3 },
    users: { total: 456, today: 12 },
    views: { total: '24.5K', change: '+12%' },
  }), []);

  // Handle logout
  const handleLogout = useCallback(() => {
    // Implement logout logic here
    console.log('Logging out...');
  }, []);

  return (
    <>
      <aside
        className={`bg-white border-r border-gray-200 fixed top-0 left-0 z-40 h-screen pt-16 transition-all duration-300 ease-in-out ${
          sidebarOpen 
            ? 'translate-x-0 w-64 shadow-lg' 
            : '-translate-x-full md:translate-x-0 md:w-20'
        }`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          {/* Collapsed View */}
          {!sidebarOpen && (
            <div className="space-y-2 mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href || '#'}
                  onClick={(e) => {
                    if (!item.href) {
                      e.preventDefault();
                      toggleItem(item.id);
                    }
                  }}
                  className={`flex items-center justify-center p-3 rounded-lg transition-colors duration-200 ${
                    isParentActive(item)
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  title={item.label}
                >
                  <span className="text-xl">{item.icon}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Expanded View */}
          {sidebarOpen && (
            <>
              {/* User info with dropdown */}
              <div className="relative p-4 mb-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div 
                  className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{user?.username || 'Admin'}</div>
                    <div className="text-xs text-gray-600">Administrator</div>
                  </div>
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {/* User dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute left-4 right-4 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-100">
                      <div className="text-sm text-gray-500">Signed in as</div>
                      <div className="font-semibold truncate">{user?.username || 'Admin'}</div>
                    </div>
                    <div className="py-1">
                      <Link 
                        href="/admin/profile" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <span className="mr-2">👤</span>
                        Your Profile
                      </Link>
                      <Link 
                        href="/admin/settings" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <span className="mr-2">⚙️</span>
                        Account Settings
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <span className="mr-2">🚪</span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
                  Quick Stats
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-blue-600">📚</span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Stories</div>
                        <div className="font-bold">{stats.stories.total}</div>
                      </div>
                    </div>
                    <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      +{stats.stories.today}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-green-600">👥</span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Users</div>
                        <div className="font-bold">{stats.users.total}</div>
                      </div>
                    </div>
                    <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      +{stats.users.today}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-purple-600">👁️</span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Views</div>
                        <div className="font-bold">{stats.views.total}</div>
                      </div>
                    </div>
                    <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      {stats.views.change}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <div key={item.id}>
                    {item.children ? (
                      <div>
                        <button
                          onClick={() => toggleItem(item.id)}
                          aria-expanded={expandedItems.includes(item.id)}
                          aria-controls={`submenu-${item.id}`}
                          className={`flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 ${
                            isParentActive(item)
                              ? 'bg-blue-50 text-blue-600 shadow-sm'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="text-lg mr-3">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                              expandedItems.includes(item.id) ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {expandedItems.includes(item.id) && (
                          <div 
                            id={`submenu-${item.id}`}
                            className="ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-300"
                            style={{
                              maxHeight: expandedItems.includes(item.id) ? '500px' : '0',
                              opacity: expandedItems.includes(item.id) ? 1 : 0
                            }}
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={`block py-2 px-4 rounded-lg text-sm transition-colors ${
                                  currentPath === child.href
                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href || '#'}
                        className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                          currentPath === item.href
                            ? 'bg-blue-50 text-blue-600 shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <span className="text-lg mr-3">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Current time display */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 px-1">
                  <div className="flex justify-between items-center">
                    <span>Last updated:</span>
                    <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Mobile overlay when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-30 md:hidden"
          onClick={() => {
            // You'll need to pass a toggle function from the parent
            // For example: onClose && onClose();
          }}
        />
      )}
    </>
  );
}