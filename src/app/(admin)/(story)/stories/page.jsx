'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import StoryCard from '@/components/StoryCard';
import StoryForm from '@/components/StoryForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import publicApi from '@/api/publicAPi';


export default function StoriesPage() {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  
  const {
    data: storiesData = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['stories', page],
    queryFn: async () => {
      const res = await publicApi.get('/stories', {
        params: { page, limit: 10 }
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const { data: stories = [], pagination = {} } = storiesData;
  console.log(stories)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return <ErrorMessage message={error.message} onRetry={refetch} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Stories</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Story
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <StoryForm 
            onClose={() => setShowForm(false)} 
            onSuccess={() => {
              setShowForm(false);
              refetch();
            }} 
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stories.map((story) => (
          <StoryCard key={story._id} story={story} />
        ))}
      </div>

      {stories.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 text-lg mb-4">No stories found. Create your first story!</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Create First Story
          </button>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Previous
          </button>
          
          <span className="text-gray-700 font-medium">
            Page {page} of {pagination.pages}
          </span>
          
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, pagination.pages))}
            disabled={page === pagination.pages}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}