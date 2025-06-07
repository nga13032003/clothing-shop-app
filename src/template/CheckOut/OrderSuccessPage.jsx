import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  TruckOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';
import './OrderSuccessPage.css';
import confetti from 'canvas-confetti';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order =
    location.state?.order ||
    JSON.parse(localStorage.getItem('orders'))?.slice(-1)[0] ||
    null;

  const [orderStatus, setOrderStatus] = useState([
    {
      status: 'Đặt hàng thành công',
      timestamp: order?.timestamp || new Date().toISOString(),
      active: true,
      icon: <CheckCircleOutlined />,
    },
    {
      status: 'Đang xử lý',
      timestamp: null,
      active: false,
      icon: <ClockCircleOutlined />,
    },
    {
      status: 'Đang giao hàng',
      timestamp: null,
      active: false,
      icon: <TruckOutlined className="truck-animate" />,
    },
    {
      status: 'Đã giao hàng',
      timestamp: null,
      active: false,
      icon: <FileDoneOutlined />,
    },
  ]);

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#22c55e', '#f97316'],
    });

    const timers = [
      setTimeout(() => {
        setOrderStatus((prev) =>
          prev.map((item, index) =>
            index === 1
              ? { ...item, active: true, timestamp: new Date().toISOString() }
              : item
          )
        );
      }, 2000),
      setTimeout(() => {
        setOrderStatus((prev) =>
          prev.map((item, index) =>
            index === 2
              ? { ...item, active: true, timestamp: new Date().toISOString() }
              : item
          )
        );
      }, 4000),
      setTimeout(() => {
        setOrderStatus((prev) =>
          prev.map((item, index) =>
            index === 3
              ? { ...item, active: true, timestamp: new Date().toISOString() }
              : item
          )
        );
      }, 6000),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

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

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString('vi-VN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="order-success-container">
      <div className="order-success-card">
        <div className="order-header">
          <CheckCircleOutlined className="order-success-icon" />
          <h1 className="order-title">Đặt hàng thành công!</h1>
          <p className="order-subtitle">
            Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.
          </p>
          <p className="order-id">
            Mã đơn hàng: <strong>{order.id}</strong>
          </p>
        </div>

        {/* Xe tải animation */}
        <div style={{ textAlign: 'center', margin: '1rem 0' }}>
          <TruckOutlined className="truck-animate" />
        </div>

        {/* Hành động */}
        <div className="order-actions">
          <button
            className="order-button-primary"
            onClick={() => navigate('/san-pham')}
          >
            Tiếp tục mua sắm
          </button>
          <button
            className="order-button-secondary"
            onClick={() => navigate('/don-hang')}
          >
            Xem đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
