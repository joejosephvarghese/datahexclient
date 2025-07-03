import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import api from "../api/axiosConfig";
import PostCard from "../components/PostCard";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch user's media posts
  useEffect(() => {
    const fetchMediaPosts = async () => {
      try {
        const response = await api.get("/media/user");
        console.log(response, "psot respnse");
        // Ensure response data is an array before setting state
        if (Array.isArray(response.data.results)) {
          setPosts(response.data.results);
        } else {
          setError("Invalid data format received");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch media posts";
        setError(errorMessage);

        if (err.response?.status === 401) {
          await authApi.logout();
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMediaPosts();
  }, [navigate]);

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await api.delete(`/media/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete item");
    }
  };

  // const handleLogout = async () => {
  //   try {
  //     await authApi.logout();
  //     localStorage.removeItem("token");
  //     navigate("/login");
  //   } catch (err) {
  //     console.error("Logout error:", err);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm bg-red-500 text-white px-3 py-1 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Media Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/post")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add New Media
          </button>
          {/* <button
            onClick={handleLogout}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Logout
          </button> */}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No media items found</p>
          <button
            onClick={() => navigate("/post")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Your First Media Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post._id || post.id} // Use either _id or id depending on your API
              post={post}
              onEdit={() => navigate(`/edit-media/${post._id || post.id}`)}
              onDelete={() => handleDelete(post._id || post.id)}
              showActions
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
