'use client'
import publicApi from '@/api/publicAPi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Loader2, Plus, AlertCircle, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AddSubCategoryPage = () => {
    const [subCategoryName, setSubCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const queryClient = useQueryClient();

    // Fetch categories
    const { data: categories = [], isLoading, isError } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await publicApi.get('/category')
            return res.data.data || []
        }
    });

    // Add subcategory mutation
    const mutation = useMutation({
        mutationFn: async (subCategoryData) => {
            const res = await publicApi.post('/sub_category', subCategoryData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            toast.success('Subcategory added successfully!');
            setSubCategoryName('');
            setSelectedCategory('');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to add subcategory');
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!subCategoryName.trim()) {
            toast.error('Please enter subcategory name');
            return;
        }
        
        if (!selectedCategory) {
            toast.error('Please select a category');
            return;
        }

        mutation.mutate({
            sub_category: subCategoryName.trim(),
            category: selectedCategory
        });
    };

    const handleReset = () => {
        setSubCategoryName('');
        setSelectedCategory('');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">Loading categories...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p className="text-lg font-medium">Failed to load categories</p>
                <p className="text-gray-600 mt-2">Please try again later</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Sub Category</h1>
                    <p className="text-gray-600">Create new subcategories under existing categories</p>
                </div>

                <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
                    {/* Form Section */}
                    <div className="p-6 md:p-8">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                {/* Category Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Category <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white text-black"
                                            required
                                            disabled={mutation.isLoading || categories.length === 0}
                                        >
                                            <option value="" className="text-gray-500">
                                                {categories.length === 0 ? 'No categories available' : 'Select a category'}
                                            </option>
                                            {categories.map((category) => (
                                                <option key={category._id} value={category._id}>
                                                    {category.name || category.categName}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Choose the main category for this subcategory
                                    </p>
                                </div>

                                {/* Subcategory Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sub Category Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={subCategoryName}
                                        onChange={(e) => setSubCategoryName(e.target.value)}
                                        placeholder="Enter subcategory name"
                                        className="w-full px-4 py-3 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        required
                                        disabled={mutation.isLoading}
                                    />
                                    <p className="mt-2 text-sm text-gray-500">
                                        Enter a descriptive name for the subcategory
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={mutation.isLoading || !selectedCategory || categories.length === 0}
                                        className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {mutation.isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Subcategory
                                            </>
                                        )}
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        disabled={mutation.isLoading}
                                        className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Clear Form
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Recent Subcategories */}
                {categories.some(cat => cat.subCategories?.length > 0) && (
                    <div className="mt-8 bg-white shadow-lg rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Existing Subcategories</h3>
                        <div className="space-y-3">
                            {categories.map((category) => (
                                category.subCategories?.length > 0 && (
                                    <div key={category._id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center mb-2">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                                            <h4 className="font-medium text-gray-900">
                                                {category.name || category.categName}
                                            </h4>
                                            <span className="ml-2 text-sm text-gray-500">
                                                ({category.subCategories.length} subcategories)
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 ml-5">
                                            {category.subCategories.map((sub) => (
                                                <span 
                                                    key={sub._id}
                                                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full border border-gray-300"
                                                >
                                                    {sub.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddSubCategoryPage;