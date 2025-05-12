import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; 
import './index.css';

import App from './template/home/home';
import Login from './template/Auth/login';
import Register from './template/Auth/register';
import ForgotPassword from './template/Auth/forgotPassword';
import SanPhamMenu from './template/Merchants/goods';

// Thay YOUR_GOOGLE_CLIENT_ID bằng clientId thật của bạn
const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID"> {/* ✅ Bọc Provider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/loai-san-pham" element={<SanPhamMenu/>}/>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
