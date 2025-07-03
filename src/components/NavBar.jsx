import React from "react";
import { Link } from "react-router-dom";

// Simple user icon SVG
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

// Function to decode JWT token
const decodeToken = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    console.log(jsonPayload, "json");
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

const NavBar = () => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  // Decode token to get user info
  const decodedToken = decodeToken(token);
  const username = decodedToken?.username || decodedToken?.name || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload(); // Refresh to update the UI
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          DataHex
        </Link>
        <ul className="flex space-x-6 text-gray-700 items-center">
          <li className="hover:text-blue-500 cursor-pointer">
            <Link to="/home">Home</Link>
          </li>
          <li className="hover:text-blue-500 cursor-pointer">
            <Link to="/dashboard">Dashbord</Link>
          </li>

          {isAuthenticated ? (
            <li className="flex items-center space-x-1 hover:text-blue-500 cursor-pointer">
              <UserIcon />
              <span className="font-medium">{username}</span>
            </li>
          ) : (
            <li className="hover:text-blue-500 cursor-pointer">
              <Link to="/contact">Contact</Link>
            </li>
          )}

          {isAuthenticated ? (
            <li className="hover:text-blue-500 cursor-pointer">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </li>
          ) : (
            <>
              <li className="hover:text-blue-500 cursor-pointer">
                <Link
                  to="/login"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Login
                </Link>
              </li>
              <li className="hover:text-blue-500 cursor-pointer">
                <Link
                  to="/register"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  Signup
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
