import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircleOutlined,

  TruckOutlined,
} from '@ant-design/icons';
import './OrderSuccessPage.css';
import './ChiTietDonHang.css'
import confetti from 'canvas-confetti';
import { getChiTietHoaDonTheoMaHD, getHoaDonTheoMaHD } from '../../api/apiCheckOut';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const { maHD } = useParams();

  const [order, setOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
 

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#22c55e', '#f97316'],
    });

  }, []);

  useEffect(() => {
    if (maHD) {
      getHoaDonTheoMaHD(maHD)
        .then(setOrder)
        .catch((err) => {
          console.error('Lỗi lấy hóa đơn:', err.message);
        });

      getChiTietHoaDonTheoMaHD(maHD)
        .then(setOrderDetails)
        .catch((err) => {
          console.error('Lỗi lấy chi tiết hóa đơn:', err.message);
        });
    }
  }, [maHD]);

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString('vi-VN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  if (!order) {
    return (
      <div className="order-success-container">
        <div className="order-error">
          <p className="order-error-text">Không tìm thấy thông tin đơn hàng.</p>
          <button
            className="order-button-primary"
            onClick={() => navigate('/san-pham')}
          >
            Quay lại mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-container">
      <div className="order-success-card">
        <div className="order-header">
          <CheckCircleOutlined className="order-success-icon" />
          <h1 className="order-title">Đặt hàng thành công!</h1>
          <p className="order-subtitle">Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.</p>
          <p className="order-details">
            Mã đơn hàng: <strong>{order.maHoaDon}</strong>
          </p>
        </div>

        <div style={{ textAlign: 'center', margin: '1rem 0' }}>
          <TruckOutlined className="truck-animate" />
        </div>

        <div className="order-status-tracker">

        </div>



        <div className="order-actions">
          <button
            className="order-button-primary"
            onClick={() => navigate('/san-pham')}
          >
            Tiếp tục mua sắm
          </button>
          <button
            className="order-button-secondary"
            onClick={() => navigate(`/chi-tiet-don-hang/${order.maHoaDon}`)}
          >
            Xem đơn hàng chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
