'use client'
import { useState } from 'react';
import publicApi from '@/api/publicAPi';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { Plus, Trash2, BookOpen, Tag, FileText, ChevronDown } from 'lucide-react';

export default function AddStoryForm() {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [parts, setParts] = useState([{ title: '', content: '' }]);

  const handleAddPart = () => setParts([...parts, { title: '', content: '' }]);
  
  const handlePartChange = (index, field, value) => {
    const newParts = [...parts];
    newParts[index][field] = value;
    setParts(newParts);
  };

  const handleRemovePart = (index) => {
    if (parts.length > 1) {
      setParts(parts.filter((_, i) => i !== index));
    }
  };

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['category'],
    queryFn: async () => {
      const res = await publicApi.get('/category');
      return res.data.data;
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await publicApi.post('/story', { title, categoryId, parts });
      toast.success('Story added successfully!');
      setTitle('');
      setCategoryId('');
      setParts([{ title: '', content: '' }]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add story');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Story</h1>
          </div>
          <p className="text-gray-600">Craft your story by adding chapters and content</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {/* Basic Info Section */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Tag className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Story Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Story Title *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Enter your story title"
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400"
                      required
                    />
                    <BookOpen className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Category Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="relative">
                    <select
                      value={categoryId}
                      onChange={e => setCategoryId(e.target.value)}
                      className="w-full px-4 py-3 pl-11 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id} className='text-black'>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <Tag className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {isLoading && (
                    <p className="mt-2 text-sm text-gray-500">Loading categories...</p>
                  )}
                </div>
              </div>
            </div>

            {/* Story Parts Section */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Story Parts</h2>
                </div>
                <button
                  type="button"
                  onClick={handleAddPart}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Part
                </button>
              </div>

              <div className="space-y-6">
                {parts.map((part, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-white border-2 border-blue-500 rounded-full">
                          <span className="font-semibold text-blue-600">{index + 1}</span>
                        </div>
                        <h3 className="font-medium text-gray-900">Part {index + 1}</h3>
                      </div>
                      {parts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePart(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Part Title *
                        </label>
                        <input
                          type="text"
                          value={part.title}
                          onChange={e => handlePartChange(index, 'title', e.target.value)}
                          placeholder={`Enter title for part ${index + 1}`}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content *
                        </label>
                        <textarea
                          value={part.content}
                          onChange={e => handlePartChange(index, 'content', e.target.value)}
                          placeholder={`Write the content for part ${index + 1}...`}
                          rows="6"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                          required
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          {part.content.length} characters
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
              >
                Publish Story
              </button>
              <p className="mt-3 text-center text-sm text-gray-500">
                Your story will be visible to readers after review
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}