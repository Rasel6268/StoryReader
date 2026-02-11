'use client';

import publicApi from '@/api/publicAPi';
import {useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function AllCategories() {
  
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('categName');
  const queryClient = useQueryClient()


  const {data: categories,isLoading} =  useQuery({
    queryKey:['category'],
    queryFn: async() => {
      const res = await publicApi.get('/category')
      return res.data.data
    }
  })
  const {mutate: deleteCategory } = useMutation({
    mutationFn: async(id) => {
      const res = await publicApi.delete(`/category/${id}`)
      return res.data;

    },
    onSuccess: () => {
      queryClient.invalidateQueries("category")
    }
  })
  const catDeleteHandler = (id) => {
      deleteCategory(id)
  }
  
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
          <div className="text-2xl font-bold text-gray-900">{categories?.length}</div>
          <div className="text-gray-600">Total Categories</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-gray-900">
            {categories?.reduce((sum, cat) => sum + cat.storyCount, 0)}
          </div>
          <div className="text-gray-600">Total Stories</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(categories?.reduce((sum, cat) => sum + cat.storyCount, 0) / categories?.length)}
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
      {categories?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">{category.categName}</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {category.storyCount} stories
                </span>
              </div>
              <div className="flex justify-between items-center">
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  View Stories →
                </button>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                    Edit
                  </button>
                  <button
                    onClick={() => catDeleteHandler(category._id)}
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
      {categories?.length > 0 && (
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