import React, { useEffect, useState } from 'react';
import { getAllSanPham } from '../../api/apiSanPham';
import { FaChevronDown, FaShoppingCart } from 'react-icons/fa';
import './goods.css';
import { useNavigate } from 'react-router-dom';
import DialogAddToCart from '../Cart/dialogAddToCart';
import { getCartItems } from '../../api/apiCartDetail';

const TrendProduct = () => {
  const [sanPhamList, setSanPhamList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3); // Số sản phẩm hiện ra
  const [selectedSanPham, setSelectedSanPham] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [cartUpdateTrigger, setCartUpdateTrigger] = useState(0);

  useEffect(() => {
    fetchCartData();
  }, [cartUpdateTrigger]);

  const fetchCartData = async () => {
    try {
      const khachHangStr = localStorage.getItem('khachHang');
      const khachHang = khachHangStr ? JSON.parse(khachHangStr) : null;
      if (!khachHang) return;
      const items = await getCartItems(khachHang.maKH);
      setCartItems(items);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error);
    }
  };

  useEffect(() => {
    async function fetchTatCaSanPham() {
      try {
        setLoading(true);
        const data = await getAllSanPham();
        setSanPhamList(data);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải sản phẩm.');
        setLoading(false);
      }
    }
    fetchTatCaSanPham();
  }, []);

  const handleMuaNgay = (event, sp) => {
    event.stopPropagation();
    const isLoggedIn = !!localStorage.getItem('khachHang');
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      setSelectedSanPham(sp);
      setOpenDialog(true);
    }
  };

  const handleOpenDialog = (sp) => {
    setSelectedSanPham(sp);
    setOpenDialog(true);
  };

  const visibleProducts = sanPhamList.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  if (loading) return <div className="p-8 text-center">Đang tải sản phẩm...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="san-pham-theo-loai">
    <div className="san-pham-grid">
        {visibleProducts.length === 0 && (
          <p className="text-gray-500 col-span-full">Không có sản phẩm nào.</p>
        )}
        {visibleProducts.map(sp => (
          <div
            key={sp.maSanPham}
            className="san-pham-item"
            onClick={() => navigate(`/product/${sp.maSanPham}`)}
            style={{ cursor: 'pointer' }}
          >
            <img src={sp.hinhAnhUrl || '/placeholder.jpg'} alt={sp.tenSanPham} />
            <h4>{sp.tenSanPham}</h4>

            <div className="san-pham-actions" onClick={(e) => e.stopPropagation()}>
            <button
              className="mua-ngay-button"
              onClick={(e) => handleMuaNgay(e, sp)}
            >
              Mua ngay 
            </button>
              <FaShoppingCart
                className="cart-icon"
                onClick={() => handleOpenDialog(sp)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Nút Xem thêm */}
      {visibleCount < sanPhamList.length && (
        <div className="text-center mt-4">
          <button className="load-more-button" onClick={handleLoadMore}>
            Xem thêm <FaChevronDown />
          </button>
        </div>
      )}

      {openDialog && selectedSanPham && (
        <DialogAddToCart
          sanPham={selectedSanPham}
          onClose={() => setOpenDialog(false)}
          fetchCartData={fetchCartData}
          setCartUpdateTrigger={setCartUpdateTrigger}
        />
      )}
    </div>
  );
};

export default TrendProduct;
