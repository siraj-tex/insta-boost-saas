import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import './index.css';

function PrivateRoute({ children }) {
  const auth = localStorage.getItem('adminAuth');
  return auth ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(131,58,180,0.3)', borderRadius: '12px', fontSize: '0.88rem' },
          success: { iconTheme: { primary: '#34d399', secondary: '#1a1a2e' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#1a1a2e' } },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
