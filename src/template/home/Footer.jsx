import React from 'react';
import { Layout } from 'antd';
import { Link } from 'react-router-dom';
import { EnvironmentOutlined, PhoneOutlined, MailOutlined, FacebookFilled, InstagramOutlined } from '@ant-design/icons';
import { Logo } from '../../assets';
import './footer.css';

const { Footer } = Layout;

const CustomFooter = () => {
  return (
    <Footer className="footer">
      <div className="footer-container">
        {/* Cột 1: Logo & Thông tin công ty */}
        <div className="footer-section">
          <div className="footer-logo">
            <img src={Logo} alt="FASIC Logo" />
            <h3>FASIC</h3>
          </div>
          <p>
            Cửa hàng thời trang FASIC - Chuyên cung cấp các sản phẩm quần áo chất lượng,
            giá tốt và dịch vụ chăm sóc khách hàng tận tình.
          </p>
        </div>

        {/* Cột 2: Thông tin liên hệ */}
        <div className="footer-section">
          <h4>Thông tin liên hệ</h4>
           <a href="#"><p><EnvironmentOutlined /> Địa chỉ: 123 Đường Thời Trang, Quận 1, TP.HCM</p></a>
          <a href="tel:18006750"><p><PhoneOutlined />  Hotline: 1800 6750</p></a>
          <a href="mailto:info@fasic.vn"><p><MailOutlined /> Email: info@fasic.vn</p></a>
          <a href="#"><p>Giờ mở cửa: 8:00 - 22:00 (Thứ 2 - Chủ nhật)</p></a>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FacebookFilled />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <InstagramOutlined />
            </a>
          </div>
        </div>

        {/* Cột 3: Liên kết nhanh */}
        <div className="footer-section">
          <h4>Liên kết nhanh</h4>
          <ul>
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/san-pham">Sản phẩm</Link></li>
            <li><Link to="/news">Tin tức</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
            <li><Link to="/about">Giới thiệu</Link></li>
          </ul>
        </div>

        {/* Cột 4: Google Maps */}
        <div className="footer-section">
          <h4>Bản đồ</h4>
          <div className="footer-map">
            <iframe
              title="FASIC Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.185135274581!2d106.70080671462264!3d10.793587192312197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752930ab01e4b1%3A0xa13baf9a7bb2ff09!2zMTIzIMSQxrDhu51uZyBUaMOhaSBUcmFuZywgUXXhuq1uIDE!5e0!3m2!1svi!2s!4v1686039825053!5m2!1svi!2s"
              width="100%"
              height="180"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Bản quyền */}
      <div className="footer-bottom">
        <p>© 2025 FASIC. All rights reserved.</p>
      </div>
    </Footer>
  );
};

export default CustomFooter;
