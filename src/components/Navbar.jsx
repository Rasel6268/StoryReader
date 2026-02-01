'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showStoryMenu, setShowStoryMenu] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const storyMenuRef = useRef(null);
  const imageMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (storyMenuRef.current && !storyMenuRef.current.contains(event.target)) {
        setShowStoryMenu(false);
      }
      if (imageMenuRef.current && !imageMenuRef.current.contains(event.target)) {
        setShowImageMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
      setShowMobileMenu(false);
    }
  };

  // Navigation items
  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: '🏠',
      dropdown: false
    },
    {
      label: 'Images',
      href: '/images',
      icon: '🖼️',
      dropdown: false,
    },
  ];

  // Mock user data
  const user = {
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop',
    isLoggedIn: true,
  };

  // Check if link is active
  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-white/90 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-xl font-bold text-gray-900 hidden md:block">StoryHub</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <div key={item.label} className="relative">
                  {item.dropdown ? (
                    <div className="relative" ref={item.label === 'Stories' ? storyMenuRef : imageMenuRef}>
                      <button
                        onClick={() => {
                          if (item.label === 'Stories') {
                            setShowStoryMenu(!showStoryMenu);
                            setShowImageMenu(false);
                          } else if (item.label === 'Images') {
                            setShowImageMenu(!showImageMenu);
                            setShowStoryMenu(false);
                          }
                        }}
                        className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                          isActive(item.href) 
                            ? 'text-blue-600 bg-blue-50' 
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                        <svg 
                          className={`w-4 h-4 ml-1 transition-transform ${
                            (item.label === 'Stories' && showStoryMenu) || 
                            (item.label === 'Images' && showImageMenu) 
                              ? 'rotate-180' : ''
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Stories Dropdown */}
                      {item.label === 'Stories' && showStoryMenu && (
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              onClick={() => setShowStoryMenu(false)}
                            >
                              <span className="mr-3">{subItem.label.includes('Write') ? '✍️' : '📖'}</span>
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Images Dropdown */}
                      {item.label === 'Images' && showImageMenu && (
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                              onClick={() => setShowImageMenu(false)}
                            >
                              <span className="mr-3">🖼️</span>
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActive(item.href) 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="container mx-auto px-4 py-4">
              {/* Mobile Navigation */}
              <div className="space-y-2">
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.dropdown ? (
                      <div className="py-2">
                        <button
                          onClick={() => {
                            if (item.label === 'Stories') {
                              setShowStoryMenu(!showStoryMenu);
                              setShowImageMenu(false);
                            } else if (item.label === 'Images') {
                              setShowImageMenu(!showImageMenu);
                              setShowStoryMenu(false);
                            }
                          }}
                          className={`flex items-center justify-between w-full px-4 py-3 rounded-lg ${
                            isActive(item.href) 
                              ? 'bg-blue-50 text-blue-600' 
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="mr-3">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <svg 
                            className={`w-4 h-4 transition-transform ${
                              (item.label === 'Stories' && showStoryMenu) || 
                              (item.label === 'Images' && showImageMenu) 
                                ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {/* Mobile Stories Dropdown */}
                        {item.label === 'Stories' && showStoryMenu && (
                          <div className="ml-6 mt-1 space-y-1">
                            {item.items.map((subItem) => (
                              <Link
                                key={subItem.label}
                                href={subItem.href}
                                className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                onClick={() => setShowMobileMenu(false)}
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* Mobile Images Dropdown */}
                        {item.label === 'Images' && showImageMenu && (
                          <div className="ml-6 mt-1 space-y-1">
                            {item.items.map((subItem) => (
                              <Link
                                key={subItem.label}
                                href={subItem.href}
                                className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                onClick={() => setShowMobileMenu(false)}
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center px-4 py-3 rounded-lg ${
                          isActive(item.href) 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
              
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}