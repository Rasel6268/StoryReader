'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';


export default function AdminLayout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when clicking on mobile link
  const handleMobileLinkClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Mock user data
  const userData = user || {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    avatar: null,
  };

  // Navigation items for breadcrumb
  const getBreadcrumbItems = () => {
    const pathSegments = pathname.split('/').filter(segment => segment);
    let breadcrumbs = [];
    
    // Start from admin
    breadcrumbs.push({ label: 'Dashboard', href: '/admin' });
    
    // Add other segments
    for (let i = 1; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      const href = '/' + pathSegments.slice(0, i + 1).join('/');
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      breadcrumbs.push({ label, href });
    }
    
    return breadcrumbs;
  };

  return (
    <div className="min-h-screen bg-gray-50">

    
      {/* Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        currentPath={pathname}
        user={userData}
      />

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="p-4 md:p-6">
          {/* Breadcrumb for desktop */}
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 mb-6">
            {getBreadcrumbItems().map((item, index) => (
              <React.Fragment key={item.href}>
                {index > 0 && <span className="text-gray-400">/</span>}
                {index === getBreadcrumbItems().length - 1 ? (
                  <span className="font-semibold text-gray-900">{item.label}</span>
                ) : (
                  <a
                    href={item.href}
                    className="hover:text-blue-600 transition-colors"
                    onClick={handleMobileLinkClick}
                  >
                    {item.label}
                  </a>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Page Title for mobile */}
          <div className="md:hidden mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {getBreadcrumbItems().slice(-1)[0]?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
              <span>Admin Panel</span>
              <span>•</span>
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            {children}
          </div>

        </div>
      </main>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Floating action button for mobile */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full shadow-lg flex items-center justify-center z-40 md:hidden"
          aria-label="Toggle menu"
        >
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      )}
    </div>
  );
}

   
    