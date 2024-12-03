import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles = [] }) => {
  const auth = useAuth();

  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && auth.user && !allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
