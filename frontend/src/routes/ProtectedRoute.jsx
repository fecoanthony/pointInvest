import React from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  // Get current user from your global auth store
  const { user } = useUserStore();

  // 1. Not logged in → send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Determine if user is an admin-type (admin or super_admin)
  const isAdmin = user.role === "admin" || user.role === "super_admin";

  // 3. If this route requires admin and the user is not admin → redirect
  if (requireAdmin && !isAdmin) {
    // normal users trying to access admin routes get sent to their dashboard
    return <Navigate to="/user-dashboard" replace />;
  }

  // 4. Otherwise, user is allowed → render the protected content
  return children;
};

export default ProtectedRoute;
