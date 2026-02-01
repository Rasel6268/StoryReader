'use client';

import { useState } from 'react';

export default function AllCategories() {
  // Mock categories data
  const [categories, setCategories] = useState([
    { id: 1, name: 'Technology', description: 'Tech news, tutorials, and reviews', storyCount: 45 },
    { id: 2, name: 'Travel', description: 'Travel guides and destination tips', storyCount: 28 },
    { id: 3, name: 'Food', description: 'Recipes, cooking tips, and restaurant reviews', storyCount: 32 },
    { id: 4, name: 'Health', description: 'Fitness, wellness, and medical advice', storyCount: 19 },
    { id: 5, name: 'Business', description: 'Startups, finance, and career advice', storyCount: 24 },
    { id: 6, name: 'Lifestyle', description: 'Home, fashion, and personal growth', storyCount: 15 },
    { id: 7, name: 'Sports', description: 'Sports news, analysis, and highlights', storyCount: 12 },
    { id: 8, name: 'Entertainment', description: 'Movies, music, and celebrity news', storyCount: 26 },
  ]);

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Filter and sort categories
  const filteredCategories = categories
    .filter(category => 
      category.name.toLowerCase().includes(search.toLowerCase()) ||
      category.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'stories') {
        return b.storyCount - a.storyCount;
      }
      return 0;
    });

  // Handle category deletion
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Categories</h1>
        <p className="text-gray-600 mt-2">Manage your content categories</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
          <div className="text-gray-600">Total Categories</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-gray-900">
            {categories.reduce((sum, cat) => sum + cat.storyCount, 0)}
          </div>
          <div className="text-gray-600">Total Stories</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(categories.reduce((sum, cat) => sum + cat.storyCount, 0) / categories.length)}
          </div>
          <div className="text-gray-600">Avg. Stories per Category</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="stories">Sort by Stories</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              + Add Category
            </button>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {category.storyCount} stories
                </span>
              </div>
              
              <p className="text-gray-600 mb-6">{category.description}</p>
              
              <div className="flex justify-between items-center">
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  View Stories →
                </button>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="text-4xl mb-4">📂</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600 mb-6">
            {search ? `No results for "${search}"` : 'Start by adding your first category'}
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            + Add Category
          </button>
        </div>
      )}

      {/* Pagination (Simple) */}
      {filteredCategories.length > 0 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              ← Previous
            </button>
            <span className="px-4 py-2">Page 1 of 1</span>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}