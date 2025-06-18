import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Badge, Dropdown, Avatar } from 'antd';
import { facebook, instagram, Logo } from '../../assets';
import { mobileMenuItems } from '../../components/mobileMenuItems';
import LoaiSanPhamMenu from '../Category/loaiSanPham';
import { getGioHangByKhachHang } from '../../api/apiCart';
import { getCartItems } from '../../api/apiCartDetail';
import {
  ShoppingCartOutlined,
  UserOutlined,
  SettingOutlined,
  LockOutlined,
  ProfileOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useCart } from '../Cart/CartContext';

const HeaderComponent = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  //const [cartCount, setCartCount] = useState(0);
  const [userName, setUserName] = useState('');
  const { cartCount, setCartCount, fetchCartData } = useCart();


  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // const fetchCartData = async () => {
  //   const khachHangStr = localStorage.getItem('khachHang');
  //   if (!khachHangStr) {
  //     setCartCount(0);
  //     return;
  //   }
  //   const khachHang = JSON.parse(khachHangStr);
  //   const maKhachHang = khachHang.maKH;

  //   try {
  //     const gioHang = await getGioHangByKhachHang(maKhachHang);
  //     if (gioHang && gioHang.length > 0) {
  //       const maGioHang = gioHang[0].maGioHang;
  //       const items = await getCartItems(maGioHang);
  //       const totalQuantity = items.reduce((sum, item) => sum + item.soLuong, 0);
  //       setCartCount(totalQuantity);
  //     } else {
  //       setCartCount(0);
  //     }
  //   } catch (error) {
  //     console.error('Lỗi khi lấy giỏ hàng:', error);
  //   }
  // };

  useEffect(() => {
    const khachHangStr = localStorage.getItem('khachHang');
    if (khachHangStr) {
      setIsLoggedIn(true);
      const khachHang = JSON.parse(khachHangStr);
      setUserName(khachHang.tenKH || 'User');
      fetchCartData();
    } else {
      setIsLoggedIn(false);
      setCartCount(0);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('khachHang');
    setIsLoggedIn(false);
    setCartCount(0);
    navigate('/login');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="account">
        <Link to="/my-account">Tài khoản của tôi</Link>
      </Menu.Item>
      <Menu.Item key="password">
        <Link to="/change-password">Đổi mật khẩu</Link>
      </Menu.Item>
      <Menu.Item key="orders">
        <Link to="/my-orders">Đơn hàng của tôi</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const handleCartClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate('/cart-item');
    }
  };

  return (
    <header className="header">
      {/* Logo */}
      <Link to="/">
        <div className="logo">
          <img alt="Logo" src={Logo} />
          <span className="logo-text">FASIC</span>
        </div>
      </Link>

      {/* Toggle menu for mobile */}
      <span className="menu-toggle" onClick={toggleMenu}>☰</span>

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

        <li
          onMouseEnter={() => setShowMenu(true)}
          onMouseLeave={() => setShowMenu(false)}
          style={{ position: 'relative' }}
        >
          <Link to="/san-pham">Sản phẩm</Link>
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
              onMouseEnter={() => setShowMenu(true)}
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
        {/* Giỏ hàng */}
        <div onClick={handleCartClick} className="cart-icon" style={{ cursor: 'pointer' }}>
            <Badge count={cartCount} size="small" offset={[0, 6]}>
            <ShoppingCartOutlined style={{ fontSize: '30px', color: '#000' }} />
            </Badge>
        </div>

        {isLoggedIn ? (
            <Dropdown
            overlay={
                <Menu style={{ width: 200, fontSize: 16 }}>
                    <Menu.Item key="account" icon={<ProfileOutlined />}>
                        <Link to="/my-account">Tài khoản của tôi</Link>
                    </Menu.Item>
                    <Menu.Item key="password" icon={<LockOutlined />}>
                        <Link to="/change-password">Đổi mật khẩu</Link>
                    </Menu.Item>
                    <Menu.Item key="orders" icon={<SettingOutlined />}>
                        <Link to="/my-orders">Đơn hàng của tôi</Link>
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        key="logout"
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        style={{ color: 'red' }} // Màu đỏ
                    >
                        Đăng xuất
                    </Menu.Item>
                    </Menu>

            }
            trigger={['click']}
            placement="bottomRight"
            >
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} size={30} style={{ marginRight: 6 }} />
                <span style={{ fontSize: 16 }}>{userName}</span>
            </div>
            </Dropdown>
        ) : (
            <>
            <Link to="/login" className="btn btn-login">Đăng nhập</Link>
            <Link to="/register" className="btn btn-register">Đăng ký</Link>
            </>
        )}
        </div>
    </header>
  );
};

export default HeaderComponent;
