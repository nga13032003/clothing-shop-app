import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  TruckOutlined,
  FileDoneOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ShoppingOutlined,
  DollarCircleOutlined,
  InfoCircleOutlined,
  DownOutlined
} from '@ant-design/icons';
import './ChiTietDonHang.css';
import confetti from 'canvas-confetti';
import { QA1 } from '../../assets';

const ChiTietDonHang = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order =
    location.state?.order ||
    JSON.parse(localStorage.getItem('orders'))?.slice(-1)[0] ||
    null;

  const [showFullPriceDetails, setShowFullPriceDetails] = useState(false);
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
      icon: <TruckOutlined />,
    },
    {
      status: 'Đã giao hàng',
      timestamp: null,
      active: false,
      icon: <FileDoneOutlined />,
    },
  ]);

  if (!order) {
    return (
      <div className="order-success-container">
        <div className="order-error">
          <p className="order-error-text">Không tìm thấy thông tin đơn hàng.</p>
          <button className="order-button" onClick={() => navigate('/san-pham')}>
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
       <div className="order-status-section">
          <div className="order-timeline-horizontal">
            {orderStatus.map((status, index) => (
              <div key={index} className={`timeline-step ${status.active ? 'active' : ''}`}>
                <div className="step-icon">{status.icon}</div>
                <div className="step-label">{status.status}</div>
                {status.timestamp && (
                  <div className="step-time">{formatDate(status.timestamp)}</div>
                )}
              </div>
            ))}
          </div>
        <div className="order-header">
          <p className="order-id">
            <InfoCircleOutlined style={{ marginRight: 6 }} /> Mã đơn hàng: <strong>{order.id}</strong>
          </p>
                  <div className="order-customer">
          <h2 className="order-details-title">
            <UserOutlined style={{ marginRight: 6 }} /> Thông tin người đặt
          </h2>
          <div className="order-details-content">
            <p><span className="order-detail-label">Họ tên:</span> {order.address.fullName}</p>
            <p><span className="order-detail-label">Số điện thoại:</span> {order.address.phone}</p>
            <p><span className="order-detail-label">Địa chỉ:</span> {order.address.street}, {order.address.ward}, {order.address.district}, {order.address.city}</p>
            <p><span className="order-detail-label">Ghi chú:</span> {order.address.note || 'Không có'}</p>
          </div>
        </div>
        </div>

       
        </div>

        <div className="order-details">
          <div className="order-products">
            {/* <h3><ShoppingOutlined style={{ marginRight: 6 }} />Sản phẩm</h3> */}
            {order.cart.map((item) => (
              <div key={item.maBienThe} className="order-product-item">
                <img src={QA1} alt="Logo" style={{ height: '150px', width: 'auto' }} />
                {/* <img src={item.hinhAnhUrl} alt={item.tenSanPham} className="product-img" /> */}
                <div className="product-info">
                  <p className="name">{item.tenSanPham}</p>
                  <p>Màu: {item.mauSac} | Size: {item.size}</p>
                  <p>Số lượng: {item.soLuong}</p>
                  <p style={{ textAlign: 'right' }}>Giá: {(item.gia * item.soLuong).toLocaleString()} ₫</p>
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary">
             <div className="price-details">
                <p><span className="order-detail-label">Tổng tiền hàng:</span> <span>{order.totalPrice.toLocaleString()} ₫</span></p>
                <p><span className="order-detail-label">Phí vận chuyển:</span> <span>{order.shippingFee.toLocaleString()} ₫</span></p>
                <p><span className="order-detail-label">Giảm giá:</span> <span>{order.discount.toLocaleString()} ₫</span></p>
                <p><span className="order-detail-label">Ngày đặt hàng:</span> <span>{formatDate(order.timestamp)}</span></p>
                <p><span className="order-detail-label">Phương thức thanh toán:</span> <span>{order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Hóa đơn điện tử'}</span></p>
                <p><span className="order-detail-label">Phương thức vận chuyển:</span> <span>{order.transport?.name} ({order.transport?.estimatedDelivery})</span></p>
              </div>
          </div>
        </div>

        <div className="order-actions">
          <button className="order-button" onClick={() => navigate('/san-pham')}>
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChiTietDonHang;