import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import './home.css';
import HeaderComponent from './Header';
import ChatBox from '../../components/chatbox';
import CustomFooter from './Footer';
import { getGioHangByKhachHang } from '../../api/apiCart';
import { getCartItems } from '../../api/apiCartDetail';

const { Content } = Layout;

const App = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [cartUpdateTrigger, setCartUpdateTrigger] = useState(0);

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
        const totalQuantity = items.reduce((sum, item) => sum + item.soLuong, 0);
        setCartCount(totalQuantity);
      } else {
        setCartCount(0);
        setCartItems([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy giỏ hàng:', error);
    }
  };

  useEffect(() => {
    const khachHang = localStorage.getItem('khachHang');
    if (khachHang) {
      setIsLoggedIn(true);
      fetchCartData();
    } else {
      setIsLoggedIn(false);
      setCartCount(0);
      setCartItems([]);
    }
  }, []);

  return (
    <Layout className="layout">
      <HeaderComponent />
      <Content className="content">
        <div>
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              fetchCartData,
              cartCount,
              cartItems,
              setCartUpdateTrigger,
            })
          )}
        </div>
        <ChatBox />
      </Content>
      <CustomFooter />
    </Layout>
  );
};

export default App;
