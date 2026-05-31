import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoadingSpinner } from './components/LoadingSpinner';

function AppRoutes() {
  const { isInitializing } = useAuth();

  if (isInitializing) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="grain-overlay" aria-hidden="true" />
      <AppRoutes />
    </AuthProvider>
  );
}
