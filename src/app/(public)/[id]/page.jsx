'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import publicApi from '@/api/publicAPi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function SingleStory() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.id;
  const [currentPartIndex, setCurrentPartIndex] = useState(0);

  // Fetch story with parts
  const {
    data: storyData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['story', storyId],
    queryFn: async () => {
      const res = await publicApi.get(`/stories/${storyId}`);
      return res.data.data;
    },
    enabled: !!storyId
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage
          message={error.message || "Failed to load story"}
          onRetry={refetch}
        />
      </div>
    );
  }

  const { story = {}, parts = [] } = storyData;
  const currentPart = parts[currentPartIndex];
  const totalParts = parts.length;

  const handlePartChange = (index) => {
    setCurrentPartIndex(index);
    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (currentPartIndex < totalParts - 1) {
      handlePartChange(currentPartIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPartIndex > 0) {
      handlePartChange(currentPartIndex - 1);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - Story Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-blue-600 mb-4 transition-colors group"
          >
            <svg 
              className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm font-medium">Back to Stories</span>
          </button>

          {/* Story Title & Meta */}
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {story.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full font-medium">
                {story.categoryId?.categName || 'Uncategorized'}
              </span>
              <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full font-medium">
                {story.subCategoryId?.sub_category || 'General'}
              </span>
              <span className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatDate(story.createdAt)}
              </span>
              <span className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {totalParts} {totalParts === 1 ? 'Part' : 'Parts'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Parts Navigation - Top (Mobile Friendly) */}
          {totalParts > 0 && (
            <>
              {/* Part Title & Progress */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      Part {currentPart?.partNumber || currentPartIndex + 1} of {totalParts}
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
                      {currentPart?.title || `Part ${currentPart?.partNumber || currentPartIndex + 1}`}
                    </h2>
                  </div>
                  
                  {/* Reading Progress */}
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${((currentPartIndex + 1) / totalParts) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {Math.round(((currentPartIndex + 1) / totalParts) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Story Content Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-8 mb-6">
                <article className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
                  {/* Part Content */}
                  <div className="text-gray-800 leading-relaxed whitespace-pre-wrap font-serif">
                    {currentPart?.content || 'No content available.'}
                  </div>
                </article>

                {/* Part Metadata */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Published {formatDate(currentPart?.createdAt)}
                      </span>
                      {currentPart?.updatedAt !== currentPart?.createdAt && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Updated {formatDate(currentPart?.updatedAt)}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center text-gray-400">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Word count: {currentPart?.content?.split(/\s+/).length || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pagination Controls - Bottom (Mobile Friendly) */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                {/* Part Number Pagination */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jump to Part:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {parts.map((part, index) => (
                      <button
                        key={part._id}
                        onClick={() => handlePartChange(index)}
                        className={`
                          min-w-[44px] h-11 px-4 rounded-lg font-medium transition-all duration-200
                          ${currentPartIndex === index 
                            ? 'bg-blue-600 text-white shadow-md scale-105' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                        `}
                      >
                        {part.partNumber || index + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Next/Previous Navigation */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={handlePrevious}
                    disabled={currentPartIndex === 0}
                    className={`
                      w-full sm:w-auto px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2
                      transition-all duration-200
                      ${currentPartIndex === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous Part
                  </button>

                  <span className="text-sm text-gray-500 order-first sm:order-none">
                    Reading Part {currentPartIndex + 1} of {totalParts}
                  </span>

                  <button
                    onClick={handleNext}
                    disabled={currentPartIndex === totalParts - 1}
                    className={`
                      w-full sm:w-auto px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2
                      transition-all duration-200
                      ${currentPartIndex === totalParts - 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                      }
                    `}
                  >
                    Next Part
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

               
              </div>
            </>
          )}

          {/* No Parts Available */}
          {totalParts === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  No Parts Published Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  This story is still being written. Check back later for updates!
                </p>
                <button
                  onClick={() => router.push('/stories')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Browse Other Stories
                </button>
              </div>
            </div>
          )}

          {/* Related Stories Section - Optional */}
          {totalParts > 0 && (
            <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                More from {story.categoryId?.categName || 'this category'}
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-gray-600 text-sm">
                  Discover more adventure stories in our collection.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}