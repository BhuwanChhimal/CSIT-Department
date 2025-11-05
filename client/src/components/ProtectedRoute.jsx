import React from 'react';
import { Navigate } from 'react-router';
import useAuthStore from '@/store/authStore';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const { profile, isLoading, fetchProfile } = useAuthStore();

    // Fetch profile if we have a token but no profile
    React.useEffect(() => {
      if (token && !profile && !isLoading) {
        fetchProfile();
      }
    }, [token, profile, isLoading, fetchProfile]);
  

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  if (role && role !== userRole) {
    return <Navigate to="/" replace />;
  }

    // Loading profile - show spinner
    if (!profile && isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      );
    }

  return children;
};

export default ProtectedRoute;