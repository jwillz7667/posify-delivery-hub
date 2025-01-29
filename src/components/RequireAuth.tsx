import { useAuth } from '../contexts/AuthContext';
import { useLocation, Navigate } from 'react-router-dom';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.pincodeRequired && !user.pincodeVerified) {
    return <Navigate to="/verify-pincode" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth; 