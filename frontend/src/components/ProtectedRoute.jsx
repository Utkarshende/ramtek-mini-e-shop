import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // If no token, redirect to Auth page with "subtle" feedback
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;