import { Navigate } from 'react-router-dom';

import { getStoredAuth } from '../services/authStorage.js';

export function ProtectedRoute({ children }) {
  return getStoredAuth() ? children : <Navigate to="/login" replace />;
}
