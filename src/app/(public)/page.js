'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Mock categories with story counts
  const categories = [
    { id: 'all', name: 'All Stories', count: 124, icon: '📚', color: 'bg-blue-100 text-blue-600' },
    { id: 'technology', name: 'Technology', count: 45, icon: '💻', color: 'bg-purple-100 text-purple-600' },
    { id: 'health', name: 'Health & Wellness', count: 28, icon: '🏥', color: 'bg-green-100 text-green-600' },
    { id: 'business', name: 'Business', count: 32, icon: '💼', color: 'bg-yellow-100 text-yellow-600' },
    { id: 'lifestyle', name: 'Lifestyle', count: 19, icon: '🎨', color: 'bg-pink-100 text-pink-600' },
    { id: 'travel', name: 'Travel', count: 15, icon: '✈️', color: 'bg-indigo-100 text-indigo-600' },
    { id: 'food', name: 'Food & Cooking', count: 22, icon: '🍴', color: 'bg-red-100 text-red-600' },
    { id: 'science', name: 'Science', count: 18, icon: '🔬', color: 'bg-cyan-100 text-cyan-600' },
    { id: 'entertainment', name: 'Entertainment', count: 26, icon: '🎬', color: 'bg-orange-100 text-orange-600' },
    { id: 'sports', name: 'Sports', count: 12, icon: '⚽', color: 'bg-emerald-100 text-emerald-600' },
  ];

  // Mock stories data
  const stories = [
    {
      id: 1,
      title: 'The Future of AI in Modern Web Development',
      excerpt: 'Exploring how artificial intelligence is revolutionizing the way we build and interact with web applications.',
      author: 'Alex Johnson',
      date: '2024-03-15',
      readTime: '8 min read',
      category: 'technology',
      views: 12450,
      likes: 890,
      comments: 156,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'Mindfulness Meditation: A Complete Guide for Beginners',
      excerpt: 'Learn how to start your mindfulness journey with simple techniques and daily practices.',
      author: 'Sarah Chen',
      date: '2024-03-14',
      readTime: '6 min read',
      category: 'health',
      views: 9870,
      likes: 654,
      comments: 89,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w-800&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'Sustainable Business Practices That Actually Work',
      excerpt: 'Real-world examples of companies successfully implementing eco-friendly strategies.',
      author: 'Michael Torres',
      date: '2024-03-13',
      readTime: '10 min read',
      category: 'business',
      views: 8450,
      likes: 543,
      comments: 76,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop'
    },
    {
      id: 4,
      title: 'The Ultimate Travel Guide to Southeast Asia',
      excerpt: 'From hidden gems to must-visit destinations, everything you need to plan your perfect trip.',
      author: 'Emma Wilson',
      date: '2024-03-12',
      readTime: '12 min read',
      category: 'travel',
      views: 7560,
      likes: 432,
      comments: 65,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&auto=format&fit=crop'
    },
    {
      id: 5,
      title: 'Home Cooking: 5 Easy Recipes for Busy Weeknights',
      excerpt: 'Delicious and healthy meals you can prepare in under 30 minutes.',
      author: 'James Miller',
      date: '2024-03-11',
      readTime: '5 min read',
      category: 'food',
      views: 6540,
      likes: 321,
      comments: 54,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop'
    },
    {
      id: 6,
      title: 'Blockchain Technology: Beyond Cryptocurrency',
      excerpt: 'Understanding the real-world applications of blockchain in various industries.',
      author: 'David Kim',
      date: '2024-03-10',
      readTime: '9 min read',
      category: 'technology',
      views: 5430,
      likes: 210,
      comments: 43,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop'
    },
    {
      id: 7,
      title: 'Morning Routines of Successful Entrepreneurs',
      excerpt: 'How starting your day right can impact your productivity and success.',
      author: 'Lisa Wang',
      date: '2024-03-09',
      readTime: '7 min read',
      category: 'lifestyle',
      views: 4320,
      likes: 198,
      comments: 32,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop'
    },
    {
      id: 8,
      title: 'Quantum Computing Explained Simply',
      excerpt: 'A beginner-friendly guide to understanding the basics of quantum computing.',
      author: 'Dr. Robert Chen',
      date: '2024-03-08',
      readTime: '11 min read',
      category: 'science',
      views: 3210,
      likes: 187,
      comments: 29,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop'
    },
  ];

  // Filter and sort stories
  const filteredStories = stories
    .filter(story => {
      const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'popular':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        case 'featured':
          return (b.isFeatured === a.isFeatured) ? 0 : b.isFeatured ? -1 : 1;
        default:
          return 0;
      }
    });

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`${category.color} w-8 h-8 rounded-lg flex items-center justify-center mr-3`}>
                        {category.icon}
                      </span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
           
            </div>
          </div>

          {/* Stories Grid */}
          <div className="lg:col-span-6">
            {/* Filters and Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCategory === 'all' ? 'All Stories' : getCategoryName(selectedCategory)}
                  </h2>
                  <p className="text-gray-600">
                    {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'} found
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="likes">Most Liked</option>
                    <option value="featured">Featured First</option>
                  </select>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <span className="mr-2">📝</span>
                    Write Story
                  </button>
                </div>
              </div>
            </div>

            {/* Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredStories.map((story) => (
                <div key={story.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 group">
                  <div className="relative h-48">
                    <Image
                      src={story.imageUrl}
                      alt={story.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 backdrop-blur-sm rounded-full text-sm font-medium text-white ${
                        story.category === 'technology' ? 'bg-blue-600/90' :
                        story.category === 'health' ? 'bg-green-600/90' :
                        story.category === 'business' ? 'bg-yellow-600/90' :
                        'bg-purple-600/90'
                      }`}>
                        {getCategoryName(story.category)}
                      </span>
                    </div>
                    {story.isFeatured && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium">
                          ⭐
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {story.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{story.excerpt}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">
                          {story.author.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{story.author}</div>
                          <div className="text-xs text-gray-500">{story.date}</div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {story.readTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-500 text-sm flex items-center">
                          👁️ {story.views.toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm flex items-center">
                          ❤️ {story.likes}
                        </span>
                        <span className="text-gray-500 text-sm flex items-center">
                          💬 {story.comments}
                        </span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Read →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredStories.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No stories found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? `No stories found for "${searchQuery}" in ${getCategoryName(selectedCategory)}`
                    : `No stories available in ${getCategoryName(selectedCategory)}`
                  }
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}

            {/* Load More Button */}
            {filteredStories.length > 0 && (
              <div className="text-center mt-8">
                <button className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  Load More Stories
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}