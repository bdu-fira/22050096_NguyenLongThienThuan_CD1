import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useSelector((state) => state.auth);
  console.log(user,token);

  if (!token || !user) {
    // Redirect to login if no token or user
    return <Navigate to="/login" />;
  }
  

  if (!allowedRoles?.length) {
        return children
  }

  // Check if user has any of the allowed roles
  const userHasRequiredRole = user?.roles?.some(role => allowedRoles.includes(role));

  if (!userHasRequiredRole) {
    // Redirect to unauthorized page or home page if no required role
    return <Navigate to="/" />; // Or a dedicated unauthorized page
  }

  // Render the children if authorized
  return children;
};

export default ProtectedRoute;