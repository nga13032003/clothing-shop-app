import React, { useEffect, useState } from 'react';
import './MyOrder.css';
import { useNavigate } from 'react-router-dom';
import { getChiTietHoaDonTheoMaHD } from '../../api/apiCheckOut';
import { getBienTheSanPhamById } from '../../api/chiTietSanPhamApi';
import { getSanPhamById } from '../../api/apiSanPham';

const TABS = [
  'Tất cả',
  'Chờ xác nhận',
  'Chờ lấy hàng',
  'Chờ giao hàng',
  'Đã giao',
  'Đổi hàng'
];

const getStatusClass = (status) => {
  const map = {
    'Chờ xác nhận': 'pending',
    'Chờ lấy hàng': 'pickup',
    'Chờ giao hàng': 'shipping',
    'Đã giao': 'delivered',
    'Đổi hàng': 'returned',
  };
  return map[status] || 'default';
};

const MyOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [orderDetails, setOrderDetails] = useState({});
  const [bienTheData, setBienTheData] = useState({});
  const [sanPhamData, setSanPhamData] = useState({});
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    fetch('https://localhost:7265/api/HoaDon')
      .then((res) => res.json())
      .then(async (data) => {
        setOrders(data);
        const allDetails = {};
        const bienTheMap = {};
        const sanPhamMap = {};

        for (const order of data) {
          const chiTiet = await getChiTietHoaDonTheoMaHD(order.maHoaDon);
          allDetails[order.maHoaDon] = chiTiet;

          const bienTheResults = await Promise.all(
            chiTiet.map(item => getBienTheSanPhamById(item.maBienThe))
          );
          bienTheResults.forEach(bt => {
            bienTheMap[bt.maBienThe] = bt;
          });

          const maSanPhams = [...new Set(bienTheResults.map(bt => bt.maSanPham))];
          const sanPhamResults = await Promise.all(
            maSanPhams.map(maSP => getSanPhamById(maSP))
          );
          sanPhamResults.forEach(sp => {
            sanPhamMap[sp.maSanPham] = sp;
          });
        }

        setOrderDetails(allDetails);
        setBienTheData(bienTheMap);
        setSanPhamData(sanPhamMap);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
      });
  }, []);

  const isWithin7Days = (ngayGiao) => {
    if (!ngayGiao) return false;
    const deliveryDate = new Date(ngayGiao);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - deliveryDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const toggleExpandOrder = (maHoaDon) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [maHoaDon]: !prev[maHoaDon],
    }));
  };

  const filteredOrders = (activeTab === 'Tất cả'
    ? orders
    : orders.filter((order) => order.trangThai_VanChuyen === activeTab)
  ).sort((a, b) => new Date(b.ngayLap) - new Date(a.ngayLap));

  return (
    <div className="order-page">
      <h1 className="title">📦 Đơn hàng của tôi</h1>

      <div className="tabs-underline">
        {TABS.map((tab) => (
          <div
            key={tab}
            className={`tab-underline ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="order-list">
        {filteredOrders.length === 0 ? (
          <div className="empty">Bạn chưa có đơn hàng nào.</div>
        ) : (
          filteredOrders.map((order) => {
            const chiTietList = orderDetails[order.maHoaDon] || [];
            const isExpanded = expandedOrders[order.maHoaDon];
            const displayedItems = isExpanded ? chiTietList : chiTietList.slice(0, 2);
            const hasMore = chiTietList.length > 2;

            return (
              <div className="order-card" key={order.maHoaDon}>
                <div className="order-header">
                  <div className="order-id-status">
                    <span className="order-id">Mã đơn hàng: <strong>{order.maHoaDon}</strong></span>
                    <span className={`status ${getStatusClass(order.trangThai_VanChuyen)}`}>
                      {order.trangThai_VanChuyen}
                    </span>
                  </div>
                  <div className="order-date">
                    <p>Ngày đặt: {new Date(order.ngayLap).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="order-body">
                  {displayedItems.map((item) => {
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

                <div className="order-footer">
                  <p className="total-amount">Thành tiền: {order.thanhTien.toLocaleString()}₫</p>
                  <div className="order-actions">
                    {hasMore && (
                      <button
                        className="see-more-btn"
                        onClick={() => toggleExpandOrder(order.maHoaDon)}
                      >
                        {isExpanded ? 'Thu gọn' : `Hiển thị thêm ${chiTietList.length - 2} sản phẩm`}
                      </button>
                    )}
                    <button
                      className="detail-btn"
                      onClick={() => navigate(`/chi-tiet-don-hang/${order.maHoaDon}`)}
                    >
                      Xem chi tiết
                    </button>
                    {order.trangThai_VanChuyen === 'Đã giao' && isWithin7Days(order.ngayGiao) && (
                      <>
                        <button
                          className="review-btn"
                          onClick={() => navigate(`/danh-gia/${order.maHoaDon}`)}
                        >
                          Đánh giá
                        </button>
                        <button
                          className="return-btn"
                          onClick={() => navigate(`/tra-hang/${order.maHoaDon}`)}
                        >
                          Trả hàng
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyOrder;