import { Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from './components/AppShell.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { WorkspacePage } from './pages/WorkspacePage.jsx';
import { getStoredAuth } from './services/authStorage.js';

function AuthRedirect({ children }) {
  return getStoredAuth() ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/login"
        element={
          <AuthRedirect>
            <LoginPage />
          </AuthRedirect>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRedirect>
            <RegisterPage />
          </AuthRedirect>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell>
              <WorkspacePage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
