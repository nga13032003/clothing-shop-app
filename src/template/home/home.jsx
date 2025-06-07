import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Badge } from 'antd';
import './home.css';
import { Link } from 'react-router-dom';
import { facebook, instagram, Logo } from '../../assets';
import { mobileMenuItems } from '../../components/mobileMenuItems';
import { ShoppingCartOutlined } from '@ant-design/icons';
import LoaiSanPhamMenu from '../Category/loaiSanPham';
import SanPhamPage from '../Merchants/goods';
import ChatBox from '../../components/chatbox';
import CustomFooter from '../../components/footer';
import { getGioHangByKhachHang } from '../../api/apiCart';
import { getCartItems } from '../../api/apiCartDetail';


const { Header, Footer, Content } = Layout;

const App = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // state cho hover menu sản phẩm
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
      setCartCount(items.length);
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
}, [cartUpdateTrigger]); 

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('khachHang');
    setIsLoggedIn(false);
    setCartCount(0);
    setCartItems([]);
  };

  return (
    <Layout className="layout">
      <Header className="header">
        {/* Logo */}
        <Link to="/">
          <div className="logo">
            <img alt="Logo" src={Logo} />
            <span className="logo-text">FASIC</span>
          </div>
        </Link>

        <span className="menu-toggle" onClick={toggleMenu}>
          ☰
        </span>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <Menu
              mode="inline"
              items={mobileMenuItems}
              style={{ width: '100%', backgroundColor: '#001529', color: '#fff' }}
            />
          </div>
        )}

        {/* Desktop menu */}
        <ul className="nav-links">
          <li><Link to="/">Trang chủ</Link></li>

          {/* Menu sản phẩm có hover */}
          <li
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
            style={{ position: 'relative' }}
          >
            <Link to="/san-pham">Sản phẩm</Link>

            {/* Hiển thị menu con khi hover */}
            {showMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                }}
                onMouseEnter={() => setShowMenu(true)}  // giữ menu khi hover vào menu con
                onMouseLeave={() => setShowMenu(false)}
              >
                <LoaiSanPhamMenu />
              </div>
            )}
          </li>

          <li><Link to="/news">Tin tức</Link></li>
          <li><Link to="/contact">Liên hệ</Link></li>
          <li><Link to="/about">Giới thiệu</Link></li>
        </ul>

        {/* Actions */}
        <div className="actions">
          <span className="hotline">
            HOTLINE: <strong>1800 6750</strong>
          </span>
          {/* <span className="icon">👤</span> */}

          {isLoggedIn ? (
            <>
              <Link to="/cart-item" className="cart-icon">
                <Badge count={cartCount} size="small" offset={[0, 6]}>
                  <ShoppingCartOutlined style={{ fontSize: '20px', color: '#000' }} />
                </Badge>
              </Link>



              <Link to="/login" onClick={handleLogout} className="btn btn-register">
                Đăng xuất
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-login">Đăng nhập</Link>
              <Link to="/register" className="btn btn-register">Đăng ký</Link>
            </>
          )}
        </div>
      </Header>

      <Content className="content">
          <div>{React.Children.map(children, (child) =>
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
