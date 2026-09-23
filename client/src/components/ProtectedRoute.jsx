import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, fallbackPath = '/login' }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login (NOT landing page)
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Authenticated - show the protected content
  return children;
};

export default ProtectedRoute;