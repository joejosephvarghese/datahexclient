import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const MediaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mediaItem, setMediaItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Get user ID from token in local storage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode the token to get user ID (assuming JWT format)
        const payload = JSON.parse(atob(token.split(".")[1]));

        setCurrentUserId(payload.sub); // Adjust this based on your token structure
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchMediaItem = async () => {
      try {
        const response = await api.get(`/media/${id}`);
        
        setMediaItem(response.data);
      } catch (err) {
        setError("Failed to fetch media item");
        console.error("Error fetching media item:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaItem();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`/media/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        navigate("/home"); // Redirect after deletion
      } catch (err) {
        console.error("Error deleting media item:", err);
        alert("Failed to delete media item");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!mediaItem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-xl">Media item not found</div>
      </div>
    );
  }

  const isOwner =
    currentUserId && mediaItem.user && currentUserId === mediaItem.user._id;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/home"
          className="inline-block mb-6 text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Home
        </Link>

        <article className="bg-white shadow-xl rounded-lg overflow-hidden relative">
          {isOwner && (
            <div className="absolute top-4 right-4 flex space-x-2">
              <Link
                to={`/edit/${mediaItem.id}`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Delete
              </button>
            </div>
          )}

          {mediaItem.imageUrl && (
            <div className="h-96 overflow-hidden">
              <img
                src={mediaItem.imageUrl}
                alt={mediaItem.title || "Media item"}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">
              {mediaItem.title || "Untitled Media"}
            </h1>

            <div className="flex items-center text-gray-500 mb-6">
              <span className="text-sm">
                {new Date(mediaItem.created_at).toLocaleDateString()}
              </span>
              {mediaItem.user && (
                <span className="text-sm ml-4">
                  Posted by: {mediaItem.user.name || "Unknown"}
                </span>
              )}
            </div>

            {mediaItem.description && (
              <div className="prose max-w-none mb-8">
                <p className="text-gray-700 whitespace-pre-line">
                  {mediaItem.description}
                </p>
              </div>
            )}

            {mediaItem.content && (
              <div className="prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: mediaItem.content }}
                  className="text-gray-700"
                />
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default MediaDetail;
