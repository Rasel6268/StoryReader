// components/stories/StoryPartList.jsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import publicApi from "@/api/publicAPi";


export default function StoryPartList({ storyId, parts = [] }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [expandedPart, setExpandedPart] = useState(null);

  // Delete part mutation
  const deletePartMutation = useMutation({
    mutationFn: async (partId) => {
      await publicApi.delete(`/stories/${storyId}/parts/${partId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["story", storyId]);
    },
  });

  const handleDeletePart = (partId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this part?")) {
      deletePartMutation.mutate(partId);
    }
  };

  const toggleExpand = (partId) => {
    setExpandedPart(expandedPart === partId ? null : partId);
  };

  if (parts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No parts available for this story yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {parts.map((part, index) => (
        <div
          key={part._id}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-300 transition-colors"
        >
          {/* Part Header */}
          <div
            onClick={() => toggleExpand(part._id)}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center space-x-4">
              <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm">
                {part.partNumber || index + 1}
              </span>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {part.title || `Part ${part.partNumber || index + 1}`}
                </h3>
                <p className="text-sm text-gray-500">
                  Added {new Date(part.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/stories/${storyId}/parts/${part._id}/edit`);
                }}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                  />
                </svg>
              </button>
              
              <button
                onClick={(e) => handleDeletePart(part._id, e)}
                disabled={deletePartMutation.isLoading}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                  />
                </svg>
              </button>
              
              {/* Expand/Collapse Icon */}
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedPart === part._id ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Part Content - Expanded */}
          {expandedPart === part._id && (
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {part.content || "No content available."}
                </p>
              </div>
              
              {/* Part Metadata */}
              <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                <div className="flex flex-wrap gap-4">
                  {part.wordCount && (
                    <span>📝 {part.wordCount} words</span>
                  )}
                  {part.readTime && (
                    <span>⏱️ {part.readTime} min read</span>
                  )}
                  {part.updatedAt && part.updatedAt !== part.createdAt && (
                    <span>✏️ Updated {new Date(part.updatedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}