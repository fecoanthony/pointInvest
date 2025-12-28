import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import BlogDetail from "./pages/BlogDetail";

import ProtectedRoute from "./routes/ProtectedRoute";
import { useUserStore } from "./stores/useUserStore";
import { allPosts } from "./components/BlogSection";
import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

// helper to decide dashboard route
const getDashboardPath = (user) => {
  if (!user) return "/";

  if (user.role === "user") return "/user-dashboard";

  if (user.role === "admin" || user.role === "super_admin") {
    return "/dashboard";
  }

  return "/";
};

const App = () => {
  const { user, getCurrentUser, checkingAuth } = useUserStore();

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog/:id" element={<BlogDetail posts={allPosts} />} />

        {/* Auth */}
        <Route
          path="/login"
          element={
            !user ? <Login /> : <Navigate to={getDashboardPath(user)} replace />
          }
        />
        <Route
          path="/register"
          element={
            !user ? (
              <Register />
            ) : (
              <Navigate to={getDashboardPath(user)} replace />
            )
          }
        />

        {/* User Dashboard (any logged-in user) */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN / SUPER_ADMIN Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
