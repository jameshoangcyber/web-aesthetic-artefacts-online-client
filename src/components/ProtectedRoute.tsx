import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin' | 'artist';
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/login',
}) => {
  const { user, isAuthenticated, loading: isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, but save the attempted location
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // User doesn't have required role
    if (user?.role === 'admin') {
      // Admin trying to access user route, allow
      return <>{children}</>;
    }
    // User trying to access admin route, redirect to home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Admin-only route wrapper
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="admin" redirectTo="/admin/login">
      {children}
    </ProtectedRoute>
  );
};

// User route wrapper (any authenticated user)
export const UserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ProtectedRoute redirectTo="/login">{children}</ProtectedRoute>;
};

