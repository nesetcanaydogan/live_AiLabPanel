import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContent.jsx";

/**
 * Senior Architect Note: 
 * Enhanced ProtectedRoute supporting Role-Based Access Control (RBAC).
 * Guards routes at the router level to prevent unauthorized component mounting 
 * and unnecessary API calls.
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const location = useLocation();

  // 1. Handle Initial Auth Resolution
  // Prevent redirects while Firebase/Backend profile is still initializing.
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-900/20 border-t-blue-900 rounded-full animate-spin" />
      </div>
    );
  }

  // 2. Authentication Guard
  if (!isAuthenticated) {
    // Save the attempted location to redirect back after login (Standard UX pattern)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Authorization Guard (RBAC)
  if (allowedRoles.length > 0) {
    const isAuthorized = allowedRoles.some(role => hasRole(role));
    
    if (!isAuthorized) {
      console.warn(`Access Denied: User lacks required roles [${allowedRoles.join(", ")}]`);
      // Redirect to a safe default page (Dashboard)
      return <Navigate to="/dashboard" replace />;
    }
  }

  // 4. Authorized Access
  return <Outlet />;
};

export default ProtectedRoute;
