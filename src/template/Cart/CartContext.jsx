// src/contexts/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getGioHangByKhachHang, getCartItems } from '../api/apiCart';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const fetchCartData = async () => {
    const khachHangStr = localStorage.getItem('khachHang');
    if (!khachHangStr) {
      setCartCount(0);
      setCartItems([]);
      return;
    }

    const khachHang = JSON.parse(khachHangStr);
    const maKhachHang = khachHang.maKH;

    try {
      const gioHang = await getGioHangByKhachHang(maKhachHang);
      if (gioHang && gioHang.length > 0) {
        const maGioHang = gioHang[0].maGioHang;
        const items = await getCartItems(maGioHang);
        setCartItems(items);
        setCartCount(items.length);
      } else {
        setCartItems([]);
        setCartCount(0);
      }
    } catch (err) {
      console.error('Lỗi lấy giỏ hàng:', err);
    }
  };

  // Fetch lần đầu khi user đã login
  useEffect(() => {
    const khachHang = localStorage.getItem('khachHang');
    if (khachHang) {
      fetchCartData();
    }
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, cartItems, fetchCartData }}>
      {children}
    </CartContext.Provider>
  );
};
