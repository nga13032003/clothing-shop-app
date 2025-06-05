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
import SanPhamTheoLoai from './template/product/sanPhamTheoLoai';
import CartSidebar from './components/CartSidebar';
import ProductDetailPage from './template/product/ProductDetailPage';
import NewsPage from './template/info/new';
import CartPage from './template/Cart/detailCart';
import DialogAddToCart from './template/Cart/dialogAddToCart';
import CheckoutPage from './template/Cart/checkOut';
import ResetPassword from './template/Auth/resetPassword';

const root = createRoot(document.getElementById('root'));
const basename = '/clothing-shop-app';
root.render(
  <StrictMode>
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <BrowserRouter basename={basename}>
        <ToastContainer position="top-center" autoClose={2000} theme="colored" />
        <Routes>
          <Route path="/" element={<App><BannerSection/></App>} />
          <Route path="/product" element={<App><ProductPage/></App>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/loai-san-pham" element={<LoaiSanPhamMenu/>}/>
          <Route path="/san-pham" element={<App><SanPhamPage/></App>}/>
          <Route path="/san-pham/loai/:maLoai" element={<App><SanPhamTheoLoai /></App>} />
          <Route path="/cart" element={<App><CartSidebar /></App>} />
          <Route path="/thanh-toan" element={<App><CheckoutPage /></App>} />
          
          <Route path="/product/:maSanPham" element={<App><ProductDetailPage/></App>} />
          <Route path="/san-pham/:maSanPham/dialog" element={<App><DialogAddToCart /></App>} />

          <Route path="/news" element={<App><NewsPage /></App>} />
            <Route path='/cart-item' element={<App><CartPage/></App>}/>
            <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
