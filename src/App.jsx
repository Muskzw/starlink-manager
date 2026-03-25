import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Subscriptions from './pages/Subscriptions';
import PaymentMethods from './pages/PaymentMethods';
import PaymentHistory from './pages/PaymentHistory';
import AdminPanel from './pages/AdminPanel';
import Settings from './pages/Settings';
import Login from './pages/Login';
import './index.css';

function ProtectedRoute() {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="payment-methods" element={<PaymentMethods />} />
            <Route path="payment-history" element={<PaymentHistory />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
