// src/components/Footer.jsx

import React from 'react';
import { Layout } from 'antd';
import './Footer.css'; // nhớ tạo file CSS kèm nếu có
import { facebook, instagram } from '../assets';

const { Footer } = Layout;

const CustomFooter = () => {
  return (
    <Footer className="footer">
      {/* Cột 1 */}
      <div className="column">
        <h3>Thông tin</h3>
        <p>Về Fasic</p>
        <p>Điều khoản dịch vụ</p>
        <p>Chính sách bảo mật</p>
      </div>

      {/* Cột 2 */}
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

      {/* Cột 3 */}
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
  );
};

export default CustomFooter;
