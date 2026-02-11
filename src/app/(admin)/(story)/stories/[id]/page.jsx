"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import publicApi from "@/api/publicAPi";
import AddStoryPartForm from "@/components/AddStoryPartForm";
import StoryPartList from "@/components/StoryPartList";

export default function StoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const storyId = params.id;
  const [showAddPartForm, setShowAddPartForm] = useState(false);

  // Fetch story details
  const {
    data: storyData = {},
    isLoading: isLoadingStory,
    isError: isStoryError,
    error: storyError,
    refetch: refetchStory,
  } = useQuery({
    queryKey: ["story", storyId],
    queryFn: async () => {
      const res = await publicApi.get(`/stories/${storyId}`);
      return res.data;
    },
    enabled: !!storyId,
  });

  const { data: story = {}, parts: storyParts = [] } = storyData;
 
  
  const partData = storyData.data?.parts

  // Add story part mutation
  const addPartMutation = useMutation({
    mutationFn: async (partData) => {
      const res = await publicApi.post(`/stories/${storyId}/parts`, partData);
      console.log(res);
      // return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["story", storyId]);
      setShowAddPartForm(false);
    },
  });

  // Delete story mutation
  const deleteStoryMutation = useMutation({
    mutationFn: async () => {
      await publicApi.delete(`/stories/${storyId}`);
    },
    onSuccess: () => {
      router.push("/stories");
      queryClient.invalidateQueries(["stories"]);
    },
  });

  if (isLoadingStory) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isStoryError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage
          message={storyError.message || "Failed to load story"}
          onRetry={refetchStory}
        />
      </div>
    );
  }

  const handleDeleteStory = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this story? This action cannot be undone.",
      )
    ) {
      deleteStoryMutation.mutate();
    }
  };

  const handleAddPart = (partData) => {
    addPartMutation.mutate(partData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Story Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
             {story.story.title || "N/A"}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="font-medium mr-1">Category:</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {story.story.categoryId.categName || "N/A"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-1">Sub-category:</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  {story.story.subCategoryId.sub_category || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => router.push(`/stories/${storyId}/edit`)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDeleteStory}
              disabled={deleteStoryMutation.isLoading}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {deleteStoryMutation.isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              {story.totalParts || 0} Parts
            </div>
          </div>

          <button
            onClick={() => setShowAddPartForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Part
          </button>
        </div>
      </div>

      {/* Add Part Form */}
      {showAddPartForm && (
        <div className="mb-8">
          <AddStoryPartForm
            storyId={storyId}
            onCancel={() => setShowAddPartForm(false)}
            onSubmit={handleAddPart}
            isLoading={addPartMutation.isLoading}
          />
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Story Parts</h2>
        <StoryPartList storyId={storyId} parts={partData} />
      </div>
    </div>
  );
}
