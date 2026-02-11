'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import publicApi from '@/api/publicAPi';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['category'],
    queryFn: async () => {
      const res = await publicApi.get('/category');
      return res.data.data || [];
    }
  });

  // Fetch stories
  const { data: stories = [], isLoading: storiesLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const res = await publicApi.get('/stories');
      // Handle different response structures
      return res.data.data || res.data || [];
    },
  });

  console.log('Categories:', categories);
  console.log('Stories:', stories);

  // Filter and sort stories
  const filteredStories = Array.isArray(stories) ? stories
    .filter(story => {
      // Handle category filtering with nested categoryId object
      const storyCategoryId = story.categoryId?._id || story.categoryId;
      const matchesCategory = selectedCategory === 'all' || storyCategoryId === selectedCategory;
      
      // Handle search
      const matchesSearch = searchQuery === '' || 
        story.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (story.categoryId?.categName || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'newest':
          return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'likes':
          return (b.likes || 0) - (a.likes || 0);
        case 'featured':
          return (b.isFeatured === a.isFeatured) ? 0 : b.isFeatured ? -1 : 1;
        default:
          return 0;
      }
    }) : [];

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'Unknown';
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.categName : 'Unknown';
  };

  // Get category details for a story
  const getStoryCategoryDetails = (story) => {
    if (story.categoryId && typeof story.categoryId === 'object') {
      return {
        id: story.categoryId._id,
        name: story.categoryId.categName || 'Unknown',
        color: getCategoryColor(story.categoryId.categName || '')
      };
    }
    return {
      id: story.categoryId,
      name: getCategoryName(story.categoryId),
      color: getCategoryColor(getCategoryName(story.categoryId))
    };
  };

  // Helper function for category colors
  const getCategoryColor = (categoryName) => {
    const colors = {
      'Adventure': 'bg-orange-100 text-orange-600',
      'Technology': 'bg-blue-100 text-blue-600',
      'Health': 'bg-green-100 text-green-600',
      'Business': 'bg-yellow-100 text-yellow-600',
      'Travel': 'bg-indigo-100 text-indigo-600',
      'Food': 'bg-red-100 text-red-600',
      'Science': 'bg-cyan-100 text-cyan-600',
      'Entertainment': 'bg-purple-100 text-purple-600',
      'Sports': 'bg-emerald-100 text-emerald-600',
      'Lifestyle': 'bg-pink-100 text-pink-600',
    };
    return colors[categoryName] || 'bg-gray-100 text-gray-600';
  };

  // Get icon for category
  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Adventure': '🏔️',
      'Technology': '💻',
      'Health': '🏥',
      'Business': '💼',
      'Travel': '✈️',
      'Food': '🍴',
      'Science': '🔬',
      'Entertainment': '🎬',
      'Sports': '⚽',
      'Lifestyle': '🎨',
    };
    return icons[categoryName] || '📚';
  };

  if (categoriesLoading || storiesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Categories</h2>
              <div className="space-y-2">
                {/* All Stories Option */}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                    selectedCategory === 'all'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                      📚
                    </span>
                    <span className="font-medium">All Stories</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedCategory === 'all'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {stories.length}
                  </span>
                </button>

                {/* Dynamic Categories */}
                {Array.isArray(categories) && categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => setSelectedCategory(category._id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                      selectedCategory === category._id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`${getCategoryColor(category.categName)} w-8 h-8 rounded-lg flex items-center justify-center mr-3`}>
                        {getCategoryIcon(category.categName)}
                      </span>
                      <span className="font-medium">{category.categName}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedCategory === category._id
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {category.storyCount || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stories Grid */}
          <div className="lg:col-span-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl hidden shadow-sm border border-gray-200 p-4 mb-6 md:block lg:block">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCategory === 'all' 
                      ? 'All Stories' 
                      : getCategoryName(selectedCategory)}
                  </h2>
                  <p className="text-gray-600">
                    {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'} found
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search stories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                  </div>

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
                </div>
              </div>
            </div>

            {/* Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map((story) => {
                const categoryDetails = getStoryCategoryDetails(story);
                
                return (
                  <div 
                    key={story._id || story.id} 
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 group cursor-pointer"
                    onClick={() => router.push(`/${story._id}`)}
                  >
                    <div className="p-5">
                      {/* Category Badge */}
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          categoryDetails.color.split(' ')[0] + ' ' + categoryDetails.color.split(' ')[1]
                        }`}>
                          {categoryDetails.name}
                        </span>
                        {story.isFeatured && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                            ⭐ Featured
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {story.title}
                      </h4>
                      
                      {/* Excerpt/Content Preview */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {story.excerpt || (story.content?.substring(0, 150) + '...') || 'No description available.'}
                      </p>
                      
                      {/* Author Info */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">
                            {(story.author?.charAt(0) || 'A')}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {story.author || 'Anonymous'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(story.createdAt || story.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {story.readTime || `${story.totalParts || 0} parts`}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-500 text-sm flex items-center">
                            👁️ {(story.views || 0).toLocaleString()}
                          </span>
                          <span className="text-gray-500 text-sm flex items-center">
                            ❤️ {story.likes || 0}
                          </span>
                          <span className="text-gray-500 text-sm flex items-center">
                            💬 {story.comments || 0}
                          </span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Read →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredStories.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No stories found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? `No stories found for "${searchQuery}"`
                    : selectedCategory !== 'all'
                    ? `No stories available in ${getCategoryName(selectedCategory)}`
                    : 'No stories available yet'
                  }
                </p>
                {(searchQuery || selectedCategory !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Load More Button - You can implement pagination later */}
            {filteredStories.length > 0 && filteredStories.length < stories.length && (
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