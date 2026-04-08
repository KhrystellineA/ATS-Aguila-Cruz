import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public pages
import Home from './pages/public/Home';
import Profile from './pages/public/Profile';

// Admin pages
import Login from './pages/admin/Login';
import Layout from './components/Layout';
import Dashboard from './pages/admin/Dashboard';
import Clients from './pages/admin/Clients';
import Referrals from './pages/admin/Referrals';
import Rewards from './pages/admin/Rewards';
import Redemptions from './pages/admin/Redemptions';
import Settings from './pages/admin/Settings';
import AuditLog from './pages/admin/AuditLog';
import Media from './pages/admin/Media';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/admin/login" replace />;
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="referrals" element={<Referrals />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="redemptions" element={<Redemptions />} />
        <Route path="settings" element={<Settings />} />
        <Route path="audit-log" element={<AuditLog />} />
        <Route path="media" element={<Media />} />
      </Route>
    </Routes>
  );
}

export default function RootApp() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
