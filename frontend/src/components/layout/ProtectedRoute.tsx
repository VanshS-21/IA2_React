import { Navigate, useLocation } from 'react-router-dom'; import { useAuth } from '../../context/AuthContext';
export function ProtectedRoute({ children }: { children: JSX.Element }): JSX.Element { const { isAuthenticated } = useAuth(); const location = useLocation(); return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: location }} />; }
