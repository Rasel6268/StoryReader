'use client';
import { useState } from 'react';
import LoadingSpinner from './ui/LoadingSpinner';
import StoryCard from './StoryCard';
import StoryForm from './StoryForm';
import { useQuery } from '@tanstack/react-query';
import publicApi from '@/api/publicAPi';

export default function StoryList() {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const {data,isLoading,isError} = useQuery({
    queryKey:['stories'],
    queryFn:async()=>{
        const res = await publicApi.get('/stories')
        return res.data
    }
  })

const { data: stories = [], pagination = {} } = data;

console.log(stories)

 

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error loading stories: {error.message}</p>
      </div>
    );
  }

  

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Stories</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Create Story
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <StoryForm onClose={() => setShowForm(false)} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories?.map((story) => (
          <StoryCard key={story._id} story={story} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-gray-600">
            Page {page} of {pagination.pages}
          </span>
          
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, pagination.pages))}
            disabled={page === pagination.pages}
            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {stories?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No stories found. Create your first story!</p>
        </div>
      )}
    </div>
  );
}