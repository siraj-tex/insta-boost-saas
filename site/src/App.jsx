import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Order from './pages/Order';
import Success from './pages/Success';
import Track from './pages/Track';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            color: '#1d1d1f',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '16px',
            fontSize: '0.9rem',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/order/:serviceId" element={<Order />} />
        <Route path="/success" element={<Success />} />
        <Route path="/track" element={<Track />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
