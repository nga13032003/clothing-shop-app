import React, { useEffect, useState } from 'react';
import { getGioHangByKhachHang } from "../../api/apiCart";
import { getCartItems, getMaBienThe, getBienTheTheoMaBienThe } from "../../api/apiCartDetail";
import { getBienTheTheoMaSP } from '../../api/chiTietSanPhamApi';
import './detailCart.css';
import { useNavigate } from 'react-router-dom';
import { emptyCart } from '../../assets';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const navigate = useNavigate(); // dùng để điều hướng

  useEffect(() => {
  async function fetchCart() {
    try {
      const khachHangStr = localStorage.getItem('khachHang');
      const khachHang = khachHangStr ? JSON.parse(khachHangStr) : null;
      if (!khachHang) return;

     const cartList = await getGioHangByKhachHang(khachHang.maKH);
const cart = Array.isArray(cartList) && cartList.length > 0 ? cartList[0] : null;

      
      if (!cart) return;

      const chiTietGioHang = await getCartItems(cart.maGioHang); // [{ maGioHang, maBienThe, soLuong }]
        console.log('Chi tiết giỏ hàng:', chiTietGioHang);

      const detailedItems = await Promise.all(
        chiTietGioHang.map(async (item) => {
          const bienThe = await getBienTheTheoMaBienThe(item.maBienThe);
          if (!bienThe) throw new Error('Không tìm thấy biến thể');

          return {
            ...item,
            ...bienThe,
            gia: bienThe.giaBan,
          };
        })
      );

      setCartItems(detailedItems);
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng:', error);
    }
  }

  fetchCart();
}, []);


  const handleQuantityChange = (maBienThe, delta) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.maBienThe === maBienThe) {
          const newQty = Math.max(1, item.soLuong + delta);
          return { ...item, soLuong: newQty };
        }
        return item;
      })
    );
  };
  const getSelectedTotal = () =>
  cartItems
    .filter(item => selectedItems.includes(item.maBienThe))
    .reduce((total, item) => total + item.soLuong * item.gia, 0);


  const getTotal = () =>
    cartItems.reduce((total, item) => total + item.soLuong * item.gia, 0);

  return (
    <div className="cart-page-wrapper">
  {cartItems.length === 0 ? (
    <div className="empty-cart">
      <div className="empty-cart-content">
        <img alt="emptyCart" src={emptyCart} className="empty-cart-img" />
        <p className="empty-message">Hiện chưa có sản phẩm nào</p>
        <button className="continue-shopping-btn" onClick={() => navigate('/san-pham')}>
          Tiếp tục mua sắm
        </button>
      </div>
    </div>
  ) : (
    <div className="cart-container">
      <div className="cart-left">
        <div className="cart-header">
          <input
            type="checkbox"
            checked={selectedItems.length === cartItems.length}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedItems(cartItems.map(item => item.maBienThe));
              } else {
                setSelectedItems([]);
              }
            }}
          />
          <span>Sản phẩm</span>
        </div>

        {cartItems.map((item) => (
          <div className="cart-item" key={item.maBienThe}>
            <input
              type="checkbox"
              checked={selectedItems.includes(item.maBienThe)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedItems([...selectedItems, item.maBienThe]);
                } else {
                  setSelectedItems(selectedItems.filter(id => id !== item.maBienThe));
                }
              }}
            />
            <img src={item.hinhAnhUrl} alt={item.tenSanPham} />
            <div className="info">
              <p className="title">{item.tenSanPham}</p>
              <p className="variant">Màu {item.mauSac}, Size {item.size}</p>
              <p className="price">{item.gia.toLocaleString()} ₫</p>
            </div>
            <div className="quantity-control">
              <button onClick={() => handleQuantityChange(item.maBienThe, -1)}>-</button>
              <input type="text" readOnly value={item.soLuong} />
              <button onClick={() => handleQuantityChange(item.maBienThe, 1)}>+</button>
              {item.tonKho < 10 && (
                <p className="low-stock">Còn {item.tonKho} sản phẩm</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Tóm tắt đơn hàng</h3>
        <p>Tiền sản phẩm: {getSelectedTotal().toLocaleString()} ₫</p>
        <p>Giảm: 0 ₫</p>
        <p className="total">Tổng cộng: {getSelectedTotal().toLocaleString()} ₫</p>
        <button
          className="checkout-button"
          disabled={selectedItems.length === 0}
          onClick={() => {
            const selectedProducts = cartItems.filter(item => selectedItems.includes(item.maBienThe));
            localStorage.setItem('selectedCart', JSON.stringify(selectedProducts));
            navigate('/thanh-toan');
          }}
        >
          Tiến hành thanh toán
        </button>
      </div>
    </div>
  )}
</div>

  );
};

export default CartPage;









