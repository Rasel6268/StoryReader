"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import publicApi from "@/api/publicAPi";

export default function AdminCreateStoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    subCategoryId: "",
    tags: [],
    coverImage: "",
    isPublished: false,
    isFeatured: false,
  });
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});

  // Fetch categories
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
    error: categoriesError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const res = await publicApi.get("/category");
      return res.data.data || [];
    },
    retry: 2,
  });

  // Fetch subcategories based on selected category
  const {
    data: subCategories = [],
    isLoading: isLoadingSubCategories,
    isError: isSubCategoriesError
  } = useQuery({
    queryKey: ["subcategories", formData.categoryId],
    queryFn: async () => {
      if (!formData.categoryId) return [];
     const res = await publicApi.get(
      `/sub_category/${formData.categoryId}/subcategories`
    );
     return res.data.data || [];
    },
    enabled: !!formData.categoryId,
  });

  // Create story mutation
  const createStoryMutation = useMutation({
    mutationFn: async (storyData) => {
      const res = await publicApi.post("/stories", storyData);
      return res.data;
    },
    onSuccess: (data) => {
      alert("Story created successfully!");
      router.push("/stories");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Error creating story: ${errorMessage}`);

      // Set form errors if available
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    },
  });

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Story title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title cannot exceed 200 characters";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category";
    }

    if (!formData.subCategoryId) {
      newErrors.subCategoryId = "Please select a sub-category";
    }

    if (formData.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add tag
  const handleAddTag = (e) => {
    e.preventDefault();
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
      setTagInput("");
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle category change - reset subcategory
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      categoryId: value,
      subCategoryId: "",
    }));

    // Clear errors
    setErrors((prev) => ({
      ...prev,
      categoryId: "",
      subCategoryId: "",
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createStoryMutation.mutate(formData);
  };

  // Save as draft
  const handleSaveDraft = () => {
    if (!formData.title.trim()) {
      alert("Story title is required even for drafts");
      return;
    }

    createStoryMutation.mutate({
      ...formData,
      isPublished: false,
    });
  };

  if (isLoadingCategories) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isCategoriesError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage
          message={categoriesError.message}
          onRetry={refetchCategories}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>

          <h1 className="text-3xl font-bold text-gray-900">Create New Story</h1>
          <p className="text-gray-600 mt-2">
            Fill in the details to create a new story
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">
                Basic Information
              </h2>

              {/* Title */}
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter a captivating title for your story"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Minimum 3 characters, maximum 200 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.description ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Briefly describe your story (optional)"
                  maxLength={500}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.description}
                  </p>
                )}
                <p
                  className={`text-sm mt-1 ${
                    formData.description.length > 450
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {formData.description.length}/500 characters
                </p>
              </div>

              {/* Cover Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.coverImage && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <div className="relative h-48 rounded-lg border overflow-hidden">
                      <img
                        src={formData.coverImage}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gray-100">
                              <p class="text-gray-500">Invalid image URL</p>
                            </div>
                          `;
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            {/* Categories */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">
                Categories
              </h2>

              {/* Category Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleCategoryChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.categoryId ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.categName}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.categoryId}
                    </p>
                  )}
                  {isCategoriesError && (
                    <p className="text-sm text-red-600 mt-1">
                      Failed to load categories
                    </p>
                  )}
                </div>

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
                    className={`w-full px-4 py-3 border rounded-lg text-black bg-white 
    focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:bg-gray-50 ${
      errors.subCategoryId ? "border-red-300" : "border-gray-300"
    }`}
                  >
                    <option value="">
                      {!formData.categoryId
                        ? "Select category first"
                        : isLoadingSubCategories
                          ? "Loading..."
                          : subCategories.length === 0
                            ? "No sub-categories available"
                            : "Select Sub-category"}
                    </option>
                    {subCategories.map((subCategory) => (
                      <option
                        key={subCategory._id}
                        value={subCategory._id}
                        className="text-black"
                      >
                        {subCategory.name}
                      </option>
                    ))}
                  </select>
                  {errors.subCategoryId && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.subCategoryId}
                    </p>
                  )}
                  {isSubCategoriesError && (
                    <p className="text-sm text-red-600 mt-1">
                      Failed to load sub-categories
                    </p>
                  )}
                  {formData.categoryId &&
                    subCategories.length === 0 &&
                    !isLoadingSubCategories && (
                      <p className="text-sm text-yellow-600 mt-1">
                        No sub-categories found for this category. Please select
                        another category.
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            {/* Tags */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">
                Tags
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Tags (Optional)
                </label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag(e);
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Display Tags */}
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {formData.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-blue-600 hover:text-blue-800 text-lg leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {formData.tags.length === 0 && (
                    <p className="text-gray-500 text-sm">No tags added yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            {/* Settings */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">
                Settings
              </h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublished"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="isPublished" className="ml-3 text-gray-700">
                    Publish immediately
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="isFeatured" className="ml-3 text-gray-700">
                    Mark as featured story
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-6 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={createStoryMutation.isLoading}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {createStoryMutation.isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Saving...
                  </>
                ) : (
                  "Save as Draft"
                )}
              </button>

              <button
                type="submit"
                disabled={createStoryMutation.isLoading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {createStoryMutation.isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Publishing...
                  </>
                ) : (
                  "Publish Story"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
