import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import './home.css';
import { Link } from 'react-router-dom';
import { facebook, instagram, Logo } from '../../assets';
import { mobileMenuItems } from '../../components/mobileMenuItems';
import { ShoppingCartOutlined } from '@ant-design/icons';
import LoaiSanPhamMenu from '../Category/loaiSanPham';
import SanPhamPage from '../Merchants/goods';

const { Header, Footer, Content } = Layout;

const App = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // state cho hover menu sản phẩm

  useEffect(() => {
    const khachHang = localStorage.getItem('khachHang');
    if (khachHang) setIsLoggedIn(true);
    else setIsLoggedIn(false);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('khachHang');
    setIsLoggedIn(false);
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
          <span className="icon">👤</span>

          {isLoggedIn ? (
            <>
              <Link to="/cart" className="cart-icon">
                <ShoppingCartOutlined />
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
        <div>{children}</div>
      </Content>

      <Footer className="footer">
        {/* ... phần footer giữ nguyên ... */}
      </Footer>
    </Layout>
  );
};

export default App;
