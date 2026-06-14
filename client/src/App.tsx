import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import PlaceholderPage from './pages/PlaceholderPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/students" element={<PlaceholderPage title="Students" />} />
            <Route path="/students/new" element={<PlaceholderPage title="Add Student" />} />
          </Route>

          <Route path="*" element={<PlaceholderPage title="Not Found" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
