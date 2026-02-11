'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import publicApi from '@/api/publicAPi';


export default function StoryForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    subCategoryId: '',
  });

  // Fetch categories
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await publicApi.get('/category');
      return res.data.data || [];
    },
  });

  // Fetch subcategories based on selected category
  const {
    data: subCategories = [],
    isLoading: isLoadingSubCategories,
    refetch: refetchSubCategories,
  } = useQuery({
    queryKey: ['subcategories', formData.categoryId],
    queryFn: async () => {
      if (!formData.categoryId) return [];
      const res = await publicApi.get(`/sub_category/${formData.categoryId}/subcategories`);
      return res.data.data || [];
    },
    enabled: !!formData.categoryId,
  });

  // Create story mutation
  const createStoryMutation = useMutation({
    mutationFn: async (data) => {
      const res = await publicApi.post('/stories', data);
      return res.data;
    },
    onSuccess: (data) => {
      onSuccess?.(data);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // Reset subcategory when category changes
      if (name === 'categoryId') {
        newData.subCategoryId = '';
        if (value) {
          refetchSubCategories();
        }
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    createStoryMutation.mutate(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create New Story</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Story Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={200}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter story title"
          />
        </div>

        {/* Category Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={isLoadingCategories}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.categName}
              </option>
            ))}
          </select>
          {isLoadingCategories && (
            <p className="text-sm text-gray-500 mt-1">Loading categories...</p>
          )}
        </div>

        {/* Sub-category Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sub-category *
          </label>
          <select
            name="subCategoryId"
            value={formData.subCategoryId}
            onChange={handleChange}
            required
            disabled={!formData.categoryId || isLoadingSubCategories}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50"
          >
            <option value="">
              {formData.categoryId ? 'Select a sub-category' : 'Select category first'}
            </option>
            {subCategories.map((subCategory) => (
              <option key={subCategory._id} value={subCategory._id}>
                {subCategory.sub_category}
              </option>
            ))}
          </select>
          {isLoadingSubCategories && (
            <p className="text-sm text-gray-500 mt-1">Loading sub-categories...</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createStoryMutation.isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createStoryMutation.isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </span>
            ) : 'Create Story'}
          </button>
        </div>
      </form>
    </div>
  );
}