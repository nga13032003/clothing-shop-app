import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

// ====================== Giao diện người dùng ======================
import App from './template/home/home';
import Login from './template/Auth/login';
import Register from './template/Auth/register';
import ForgotPassword from './template/Auth/forgotPassword';
import ResetPassword from './template/Auth/resetPassword';
import MyProfile from './template/Auth/myProfile';

import BannerSection from './template/home/homeContent';
import ProductPage from './template/product/product';
import SanPhamPage from './template/Merchants/goods';
import LoaiSanPhamMenu from './template/Category/loaiSanPham';
import SanPhamTheoLoai from './template/product/sanPhamTheoLoai';
import CartSidebar from './components/CartSidebar';
import ProductDetailPage from './template/product/ProductDetailPage';
import NewsPage from './template/info/new';
import CartPage from './template/Cart/detailCart';
import DialogAddToCart from './template/Cart/dialogAddToCart';
import CheckoutPage from './template/CheckOut/checkOut';
import OrderSuccessPage from './template/CheckOut/OrderSuccessPage';
import ChiTietDonHang from './template/CheckOut/ChiTietDonHang';
import MyOrder from './template/CheckOut/MyOrder';

// ====================== Giao diện Admin ======================
import AdminDashboard from './template/Admin/AdminDashboard';
import ProductManagement from './template/Admin/ProductManagement';
import LoaiSanPhamManagement from './template/Admin/LoaiSanPhamManagement';
import LoginAdmin from './template/Admin/LoginAdmin';
import AdminOtp from './template/Admin/AdminOtp';

// ====================== Kiểm tra đường dẫn ======================
const isAdmin = window.location.pathname.startsWith('/fasic.admin-portal');

// ====================== App người dùng ======================
const userApp = (
  <BrowserRouter basename="/fasic.vn">
    <ToastContainer position="top-center" autoClose={2000} theme="colored" />
    <Routes>
      <Route path="/" element={<App><BannerSection /></App>} />
      <Route path="/product" element={<App><ProductPage /></App>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/my-account" element={<App><MyProfile /></App>} />
      <Route path="/loai-san-pham" element={<LoaiSanPhamMenu />} />
      <Route path="/san-pham" element={<App><SanPhamPage /></App>} />
      <Route path="/san-pham/loai/:maLoai" element={<App><SanPhamTheoLoai /></App>} />
      <Route path="/cart" element={<App><CartSidebar /></App>} />
      <Route path="/thanh-toan" element={<App><CheckoutPage /></App>} />
      <Route path="/product/:maSanPham" element={<App><ProductDetailPage /></App>} />
      <Route path="/san-pham/:maSanPham/dialog" element={<App><DialogAddToCart /></App>} />
      <Route path="/news" element={<App><NewsPage /></App>} />
      <Route path="/cart-item" element={<App><CartPage /></App>} />
      <Route path="/don-hang-cua-toi/:maHD" element={<App><OrderSuccessPage /></App>} />
      <Route path="/chi-tiet-don-hang/:maHoaDon" element={<App><ChiTietDonHang /></App>} />
      <Route path="/my-orders" element={<App><MyOrder /></App>} />
    </Routes>
  </BrowserRouter>
);

// ====================== App admin ======================
const adminApp = (
  <BrowserRouter basename="/fasic.admin-portal">
    <ToastContainer position="top-center" autoClose={2000} theme="colored" />
    <Routes>
      <Route path="/" element={<LoginAdmin />} />
      <Route path="/verify-otp" element={<AdminOtp />} />
      <Route path="/product-management" element={<ProductManagement />} />
      <Route path="/category-management" element={<LoaiSanPhamManagement />} />
    </Routes>
  </BrowserRouter>
);


// ====================== Render ứng dụng ======================
const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      {isAdmin ? adminApp : userApp}
    </GoogleOAuthProvider>
  </StrictMode>
);
