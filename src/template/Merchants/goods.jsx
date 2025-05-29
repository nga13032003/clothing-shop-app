import React, { useEffect, useState } from 'react';
import { getAllSanPham } from '../../api/apiSanPham';
import { FaShoppingCart } from 'react-icons/fa';
import CartSidebar from '../../components/CartSidebar';  // import component mới
import '../product/sanpham.css';
import './goods.css';
import { useNavigate } from 'react-router-dom';

const SanPhamPage = () => {
  const [sanPhamList, setSanPhamList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const sanPhamPerPage = 12;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const goToCartPage = () => {
    navigate('/cart');
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

  const indexOfLastProduct = currentPage * sanPhamPerPage;
  const indexOfFirstProduct = indexOfLastProduct - sanPhamPerPage;
  const currentProducts = sanPhamList.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(sanPhamList.length / sanPhamPerPage);

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  if (loading) return <div className="p-8 text-center">Đang tải sản phẩm...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="san-pham-theo-loai">
      <h2>Tất cả sản phẩm</h2>

      <div className="san-pham-grid">
        {currentProducts.length === 0 && (
          <p className="text-gray-500 col-span-full">Không có sản phẩm nào.</p>
        )}
       {currentProducts.map(sp => (
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
              onClick={() => {
                // TODO: Thêm logic Mua ngay ở đây
                console.log(`Mua ngay: ${sp.maSanPham}`);
              }}
            >
              Mua ngay
            </button>
            <FaShoppingCart
              className="cart-icon"
              onClick={() => {
                toggleCart();
                console.log(`Thêm vào giỏ: ${sp.maSanPham}`);
              }}
            />
          </div>
        </div>
      ))}
      </div>

      {/* Phân trang */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
          <button
            key={pageNum}
            className={`pagination-button ${pageNum === currentPage ? 'active' : ''}`}
            onClick={() => setCurrentPage(pageNum)}
          >
            {pageNum}
          </button>
        ))}
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}>
        <p>Giỏ hàng trống.</p>
      </CartSidebar>
    </div>
  );
};

export default SanPhamPage;
