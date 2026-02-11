'use client';

import publicApi from '@/api/publicAPi';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';


export default function StoryCard({ story }) {


console.log(story.subCategoryId?.sub_category)


  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-800 truncate">
            {story.title}
          </h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {story.totalParts} parts
          </span>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">Category:</span>
            <span>{story.categoryId?.categName || 'N/A'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">Sub-category:</span>
             <span>{story.subCategoryId?.sub_category}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Link
            href={`/stories/${story._id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            View Details →
          </Link>
          
          <div className="flex space-x-2">
            <button className="text-gray-400 hover:text-red-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}