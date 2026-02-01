'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import publicApi from '@/api/publicAPi';
import { Plus, Loader2, X, Check } from 'lucide-react';

export default function AddCategoryPage() {
  const [name, setName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, error, isLoading } = useMutation({
    mutationFn: async (categoryData) => {
      const res = await publicApi.post('/category', categoryData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['category']);
      setName('');
      setShowForm(false);
      toast.success('Category added successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to add category';
      toast.error(errorMessage);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter a category name');
      return;
    }
 
    mutate({ name });
  };

  const handleCancel = () => {
    setName('');
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>
            <p className="text-gray-600 mt-1">Create and manage product categories</p>
          </div>
          
          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </button>
          )}
        </div>

        {/* Category Form */}
        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="space-y-4">
                <div>
                  <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="categoryName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Electronics, Clothing, Books"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    autoFocus
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Enter a descriptive name for your category
                  </p>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm font-medium">
                      {error.response?.data?.message || 'Failed to add category'}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Add Category
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="inline-flex items-center px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          /* Empty State */
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No category being added</h3>
              <p className="text-gray-600 mb-6">Click the button above to create a new category</p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Category
              </button>
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
}