import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ClockCircleOutlined,
  TruckOutlined,
  FileDoneOutlined,
  UserOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import './ChiTietDonHang.css';
import {
  getChiTietHoaDonTheoMaHD,
  getHoaDonTheoMaHD,
} from '../../api/apiCheckOut';
import { getKhachHangByMa } from '../../api/register';
import { getBienTheSanPhamById } from '../../api/chiTietSanPhamApi';
import { getSanPhamById } from '../../api/apiSanPham';

const ChiTietDonHang = () => {
  const navigate = useNavigate();
  const { maHoaDon } = useParams();

  const [order, setOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [bienTheData, setBienTheData] = useState({});
  const [sanPhamData, setSanPhamData] = useState({});

  const [orderStatus, setOrderStatus] = useState([
    { status: 'Chờ xác nhận', key: 'Chờ xác nhận', icon: <ClockCircleOutlined />, active: false, timestamp: null },
    { status: 'Đang lấy hàng', key: 'Chờ lấy hàng', icon: <TruckOutlined />, active: false, timestamp: null },
    { status: 'Đang giao hàng', key: 'Đang giao hàng', icon: <TruckOutlined />, active: false, timestamp: null },
    { status: 'Đã giao hàng', key: 'Đã giao hàng', icon: <FileDoneOutlined />, active: false, timestamp: null },
    { status: 'Giao thất bại', key: 'Giao thất bại', icon: <FileDoneOutlined />, active: false, timestamp: null },
  ]);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const hoaDon = await getHoaDonTheoMaHD(maHoaDon);
        setOrder(hoaDon);

        const chiTiet = await getChiTietHoaDonTheoMaHD(maHoaDon);
        setOrderDetails(chiTiet);

        // Load thông tin biến thể
        const bienThePromises = chiTiet.map(item =>
          getBienTheSanPhamById(item.maBienThe)
        );
        const bienTheResults = await Promise.all(bienThePromises);

        const bienTheMap = {};
        bienTheResults.forEach(bt => {
          bienTheMap[bt.maBienThe] = bt;
        });
        setBienTheData(bienTheMap);

        // Load thông tin sản phẩm
        const maSanPhams = [...new Set(bienTheResults.map(bt => bt.maSanPham))];
        const sanPhamPromises = maSanPhams.map(maSP => getSanPhamById(maSP));
        const sanPhamResults = await Promise.all(sanPhamPromises);

        const sanPhamMap = {};
        sanPhamResults.forEach(sp => {
          sanPhamMap[sp.maSanPham] = sp;
        });
        setSanPhamData(sanPhamMap);

        // Lấy thông tin khách hàng
        if (hoaDon.maKH) {
          const khachHang = await getKhachHangByMa(hoaDon.maKH);
          setCustomer(khachHang);
        }

        // Cập nhật trạng thái đơn
        setOrderStatus(prev =>
          prev.map(item => ({
            ...item,
            active: item.key === hoaDon.trangThai_VanChuyen,
            timestamp: item.key === 'Chờ xác nhận' ? hoaDon.ngayLap : null,
          }))
        );
      } catch (err) {
        console.error('Lỗi lấy dữ liệu:', err.message);
      }
    };

    if (maHoaDon) {
      fetchOrderData();
    }
  }, [maHoaDon]);

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
          <button className="order-button" onClick={() => navigate('/san-pham')}>
            Quay lại mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-container">
      <div className="order-success-card">
        {/* Timeline trạng thái đơn hàng */}
        <div className="order-status-section">
          <div className="order-timeline-horizontal">
            {orderStatus.map((status, index) => (
              <div key={index} className={`timeline-step ${status.active ? 'active' : ''}`}>
                <div className="step-icon">{status.icon}</div>
                <div className="step-label">{status.status}</div>
                {status.timestamp && <div className="step-time">{formatDate(status.timestamp)}</div>}
              </div>
            ))}
          </div>

          {/* Mã đơn hàng + Khách hàng */}
          <div className="order-header">
            <p className="order-id">
              <InfoCircleOutlined style={{ marginRight: 6 }} />
              Mã đơn hàng: <strong>{order.maHoaDon}</strong>
            </p>

            <div className="order-customer">
              <h2 className="order-details-title">
                <UserOutlined style={{ marginRight: 6 }} />
                Thông tin người nhận
              </h2>
              <div className="order-details-content">
                <p><span className="order-detail-label">Họ tên:</span> {customer?.tenKH || 'N/A'}</p>
                <p><span className="order-detail-label">SĐT:</span> {customer?.soDienThoai || 'N/A'}</p>
                <p><span className="order-detail-label">Địa chỉ:</span> {customer?.diaChi || 'N/A'}</p>
                <p><span className="order-detail-label">Ghi chú:</span> {order.ghiChu || 'Không có'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="order-details">
          <div className="order-products">
            <h3>Danh sách sản phẩm</h3>
            {orderDetails.map((item) => {
              const bienThe = bienTheData[item.maBienThe];
              const sanPham = bienThe ? sanPhamData[bienThe.maSanPham] : null;

              return (
              <div key={item.maChiTietHD} className="order-product-item">
                <img
                  src={bienThe?.hinhAnhUrl}
                  alt="Hình sản phẩm"
                  className="product-img"
                />
                <div className="product-info">
                  <p className="name"><strong>{sanPham?.tenSanPham || 'Tên sản phẩm'}</strong></p>
                  <p>Phân loại: Màu {bienThe?.mauSac} - Size {bienThe?.size}</p>
                  <p>Số lượng: {item.soLuong}</p>
                  <p>Giá bán: {item.giaBan.toLocaleString()} ₫</p>
                  <p>Giảm giá: {item.giaGiam.toLocaleString()} ₫</p>
                  <p><strong>Thành tiền: {item.thanhTien.toLocaleString()} ₫</strong></p>
                </div>
              </div>

              );
            })}
          </div>

          {/* Tổng kết đơn hàng */}
          <div className="order-summary">
            <h3>Tóm tắt đơn hàng</h3>
            <p><span className="order-detail-label">Tổng tiền hàng:</span> {order.tongTien.toLocaleString()} ₫</p>
            <p><span className="order-detail-label">Giảm giá:</span> {order.giamGia?.toLocaleString() || '0'} ₫</p>
            <p><span className="order-detail-label">Thành tiền:</span> {order.thanhTien.toLocaleString()} ₫</p>
            <p><span className="order-detail-label">Phương thức thanh toán:</span> {order.maTT === 'COD' ? 'Thanh toán khi nhận hàng' : order.maTT}</p>
            <p><span className="order-detail-label">Trạng thái vận chuyển:</span> {order.trangThai_VanChuyen}</p>
            <p><span className="order-detail-label">Ngày đặt hàng:</span> {formatDate(order.ngayLap)}</p>
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
