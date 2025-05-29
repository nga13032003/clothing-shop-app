import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import './home.css';
import { Link } from 'react-router-dom';
import { facebook, instagram, Logo } from '../../assets';
import { mobileMenuItems } from '../../components/mobileMenuItems';
import { ShoppingCartOutlined } from '@ant-design/icons';
import ChatBox from '../../components/chatbox';


const { Header, Footer, Content } = Layout;

const App = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kiểm tra xem người dùng đã đăng nhập hay chưa
  useEffect(() => {
    const khachHang = localStorage.getItem('khachHang');
    if (khachHang) {
      setIsLoggedIn(true); // Người dùng đã đăng nhập
    } else {
      setIsLoggedIn(false); // Người dùng chưa đăng nhập
    }
  }, []);

  // Toggle menu visibility on small screens
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('khachHang');
    setIsLoggedIn(false);
  };

  return (
    <Layout className="layout">
      {/* Header Section */}
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

        {/* Menu cho mobile (chỉ hiện khi mở) */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <Menu
              mode="inline"
              items={mobileMenuItems}
              style={{ width: '100%', backgroundColor: '#001529', color: '#fff' }}
            />
          </div>
        )}

        {/* Menu desktop (ẩn khi mobile, hiện khi lớn hơn) */}
        <ul className="nav-links">
          <li><Link to="/">Trang chủ</Link></li>
          <li><Link to="/loai-san-pham">Sản phẩm</Link></li>
          <li><Link to="/news">Tin tức</Link></li>
          <li><Link to="/contact">Liên hệ</Link></li>
          <li><Link to="/about">Giới thiệu</Link></li>
        </ul>

        {/* Actions Section */}
        <div className="actions">
          <span className="hotline">
            HOTLINE: <strong>1800 6750</strong>
          </span>
          <span className="icon">👤</span>

          {isLoggedIn ? (
            <>
              <Link to="/cart" className="cart-icon">
                <ShoppingCartOutlined/>
              </Link>

              <Link to="/login" onClick={handleLogout} className="btn btn-register">Đăng xuất</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-login">Đăng nhập</Link>
              <Link to="/register" className="btn btn-register">Đăng ký</Link>
            </>
          )}
        </div>
      </Header>

      {/* Content Section */}
      <Content className="content">
        <div>{children}</div>
           <ChatBox />
      </Content>

      {/* Footer Section */}
      <Footer className="footer">
        <div className="column">
          <h3>Thông tin</h3>
          <p>Về Fasic</p>
          <p>Điều khoản dịch vụ</p>
          <p>Chính sách bảo mật</p>
        </div>
        <div className="column">
          <h3>Số điện thoại & Liên hệ</h3>
          <p>Hotline: 0355 470 624</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img alt="Facebook" src={facebook} className="icon" /> Fasic.vn
            </a><br />

            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img alt="Instagram" src={instagram} className="icon" /> Fasic.vn
            </a>
          </div>
        </div>
        <div className="column">
          <h3>Địa chỉ</h3>
          <p>145/11 Thạnh Xuân 52, Phường Thạnh Xuân, Quận 12, TP.HCM</p>
          <div className="map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.2897598811303!2d106.65673267590001!3d10.760151659543084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752e23b1269797%3A0xa6e52944eb8f03a2!2zMTQ1LzExIFRow6BuaCBYdcOibiA1MiwgVGjDoG5oIFh1w6JuLCBRdeG6rW4gMTIsIFRow6BuaCBwaOG7kSBI4bqjbSBNaW5oLCBWaWV0bmFt!5e0!3m2!1svi!2s!4v1684991152422!5m2!1svi!2s"
              title="Google Map"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default App;
