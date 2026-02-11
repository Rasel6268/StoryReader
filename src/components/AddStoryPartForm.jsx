// components/forms/AddStoryPartForm.jsx
import { useState, useEffect } from "react";

export default function AddStoryPartForm({ storyId, onCancel, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    partNumber: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.content?.trim()) {
      newErrors.content = "Content is required";
    }
    
    if (formData.content?.trim().length < 50) {
      newErrors.content = "Content should be at least 50 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Only send title and content - partNumber will be added by the backend
      onSubmit({
        title: formData.title,
        content: formData.content,
        partNumber: formData.partNumber
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      content: "",
      partNumber: ""
    });
    setErrors({});
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Story Part</h3>
      
      <div className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Part Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a title for this part"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            maxLength={200}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.title.length}/200 characters
          </p>
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-mediumb` text-gray-700 mb-1">
            Part Number <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="part number"
            name="partNumber"
            value={formData.partNumber}
            min='1'
            onChange={handleChange}
            placeholder="Enter Story part Number"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
              errors.partNumber ? "border-red-500" : "border-gray-300"
            }`}
            maxLength={200}
          />
          {errors.partNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.partNumber}</p>
          )}
        </div>

        {/* Content - Required */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="12"
            placeholder="Write your story part here..."
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-y ${
              errors.content ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-500">
              Minimum 50 characters. Currently: {formData.content.length} characters
            </p>
            {formData.content.length > 0 && (
              <p className="text-xs text-gray-500">
                ~{Math.max(1, Math.ceil(formData.content.split(" ").length / 200))} min read
              </p>
            )}
          </div>
        </div>

        {/* Info Message - Auto-generated part number */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg 
              className="w-5 h-5 text-blue-600 mt-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <div>
              <p className="text-sm text-blue-800 font-medium">
                Part number will be automatically assigned
              </p>
              <p className="text-xs text-blue-600 mt-1">
                The part number is auto-generated based on the existing parts in this story.
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : (
              "Add Part"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}