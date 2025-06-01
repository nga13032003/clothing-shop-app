import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './checkOut.css';

const CheckoutPage = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedCartStr = localStorage.getItem('selectedCart');
    const selected = selectedCartStr ? JSON.parse(selectedCartStr) : [];
    setSelectedItems(selected);
  }, []);

  const getTotal = () =>
    selectedItems.reduce((total, item) => total + item.soLuong * item.gia, 0);

  const handlePlaceOrder = () => {
    // Giả lập đặt hàng (ở đây bạn có thể gọi API đặt hàng thật)
    alert('Đặt hàng thành công!');
    localStorage.removeItem('selectedCart');
    navigate('/'); // hoặc điều hướng đến trang xác nhận
  };

  return (
    <div className="checkout-wrapper">
      <h2>Trang thanh toán</h2>

      {selectedItems.length === 0 ? (
        <p>Không có sản phẩm nào để thanh toán.</p>
      ) : (
        <div className="checkout-container">
          <div className="checkout-list">
            {selectedItems.map((item) => (
              <div key={item.maBienThe} className="checkout-item">
                <img src={item.hinhAnhUrl} alt={item.tenSanPham} />
                <div className="info">
                  <p className="title">{item.tenSanPham}</p>
                  <p className="variant">Màu: {item.mauSac}, Size: {item.size}</p>
                  <p className="price">{item.gia.toLocaleString()} ₫</p>
                  <p>Số lượng: {item.soLuong}</p>
                  <p className="subtotal">
                    Thành tiền: {(item.soLuong * item.gia).toLocaleString()} ₫
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-summary">
            <h3>Tóm tắt</h3>
            <p>Tổng tiền: {getTotal().toLocaleString()} ₫</p>
            <button onClick={handlePlaceOrder} className="place-order-button">
              Đặt hàng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
