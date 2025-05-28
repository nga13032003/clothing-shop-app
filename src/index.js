import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; 
import { ToastContainer } from 'react-toastify'; 
import './index.css';

import App from './template/home/home';
import Login from './template/Auth/login';
import Register from './template/Auth/register';
import ForgotPassword from './template/Auth/forgotPassword';
import SanPhamPage from './template/Merchants/goods';
import BannerSection from './template/home/homeContent';
import ProductPage from './template/product/product';
import LoaiSanPhamMenu from './template/Category/loaiSanPham';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <BrowserRouter>
        <ToastContainer position="top-center" autoClose={2000} theme="colored" />
        <Routes>
          <Route path="/" element={<App><BannerSection/></App>} />
          <Route path="/product" element={<App><ProductPage/></App>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/loai-san-pham" element={<LoaiSanPhamMenu/>}/>
          <Route path="/san-pham" element={<SanPhamPage/>}/>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
