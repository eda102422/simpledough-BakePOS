import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false, customerOnly = false }) => {
  const { user, loading } = useAuth();
  // ⏳ While auth is loading, show a simple loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // ❌ Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔥 CLEAN role detection
  const role = user.role; // 👈 Your AuthContext guarantees this exists

  // 🔐 Route protection
  if (adminOnly && role !== 'admin') {
    return <Navigate to="/menu" replace />;
  }

  if (customerOnly && role !== 'customer') {
    return <Navigate to="/admin" replace />;
  }

  // ✅ Access granted
  return children;
};

export default ProtectedRoute;
