import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the admin panel. Only administrators can access this area.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;