import React, { useEffect, useState } from 'react';
import { getGioHangByKhachHang, deleteGioHang } from "../../api/apiCart";
import { getCartItems, getBienTheTheoMaBienThe, removeFromCart } from "../../api/apiCartDetail";
import './detailCart.css';
import { useNavigate } from 'react-router-dom';
import { emptyCart } from '../../assets';
import { FaTrash } from 'react-icons/fa';

const CartPage = ({ fetchCartData }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [maGioHang, setMaGioHang] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
  fetchCartData();
}, [fetchCartData]);


  // Hàm tải dữ liệu giỏ hàng chi tiết
  const loadCart = async () => {
    try {
      const khachHangStr = localStorage.getItem('khachHang');
      const khachHang = khachHangStr ? JSON.parse(khachHangStr) : null;
      if (!khachHang) return;

      // Lấy giỏ hàng của khách hàng
      const cartList = await getGioHangByKhachHang(khachHang.maKH);
      const cart = Array.isArray(cartList) && cartList.length > 0 ? cartList[0] : null;
      if (!cart) {
        setCartItems([]);
        setSelectedItems([]);
        setMaGioHang(null);
        return;
      }

      setMaGioHang(cart.maGioHang);

      // Lấy chi tiết giỏ hàng
      const chiTietGioHang = await getCartItems(cart.maGioHang);

      // Lấy thêm thông tin biến thể sản phẩm
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
      setSelectedItems([]); // reset chọn khi tải lại giỏ
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng:', error);
    }
  };

  // Load giỏ hàng lần đầu
  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantityChange = (maBienThe, delta) => {
  setCartItems(prev =>
    prev.map(item => {
      if (item.maBienThe === maBienThe) {
        const newQty = Math.min(item.tonKho, Math.max(1, item.soLuong + delta));
        return { ...item, soLuong: newQty };
      }
      return item;
    })
  );
};

//const handleDecrease = () => setSoLuong(prev => (prev > 1 ? prev - 1 : 1));


  // Tính tổng tiền các sản phẩm được chọn
  const getSelectedTotal = () =>
    cartItems
      .filter(item => selectedItems.includes(item.maBienThe))
      .reduce((total, item) => total + item.soLuong * item.gia, 0);

  // Xóa 1 sản phẩm khỏi giỏ
  const handleRemoveItem = async (maBienThe) => {
    try {
      if (!maGioHang) return;

      await removeFromCart(maGioHang, maBienThe);

      setCartItems(prev => prev.filter(item => item.maBienThe !== maBienThe));
      setSelectedItems(prev => prev.filter(id => id !== maBienThe));

      // Đồng bộ lại số lượng icon giỏ hàng trên Home
      if (fetchCartData) {
        await fetchCartData();
      }
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm khỏi giỏ:', error);
    }
  };

  // Xóa toàn bộ giỏ hàng
  const handleDeleteAll = async () => {
    try {
      if (!maGioHang) return;

      await deleteGioHang(maGioHang);
      setCartItems([]);
      setSelectedItems([]);

      // Đồng bộ lại số lượng icon giỏ hàng trên Home
      if (fetchCartData) {
        await fetchCartData();
      }
    } catch (error) {
      console.error('Lỗi khi xóa toàn bộ giỏ hàng:', error);
    }
  };

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
              {selectedItems.length === cartItems.length && cartItems.length > 0 && (
                <button className="delete-all-btn" onClick={handleDeleteAll} title="Xóa tất cả sản phẩm">
                  <FaTrash /> Xóa tất cả
                </button>
              )}
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
                  <button
                    onClick={() => handleQuantityChange(item.maBienThe, -1)}
                    disabled={item.soLuong <= 1}
                  >
                    -
                  </button>
                  <input type="text" readOnly value={item.soLuong} />
                  <button
                    onClick={() => handleQuantityChange(item.maBienThe, 1)}
                    disabled={item.soLuong >= item.tonKho}
                  >
                    +
                  </button>

                  {item.soLuong >= item.tonKho && (
                    <p className="stock-warning">Đã đạt số lượng tối đa trong kho</p>
                  )}
                  {item.tonKho < 10 && item.soLuong < item.tonKho && (
                    <p className="low-stock">Chỉ còn {item.tonKho} sản phẩm</p>
                  )}
                </div>

                <button
                  className="delete-button"
                  onClick={() => handleRemoveItem(item.maBienThe)}
                  title="Xóa sản phẩm"
                >
                  <FaTrash />
                </button>
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
