import React, { useEffect, useState } from 'react';
import { getAllSanPham } from '../../api/apiSanPham';
import { FaShoppingCart } from 'react-icons/fa';
//import CartSidebar from '../../components/CartSidebar';  // import component mới
import '../product/sanpham.css';
import './goods.css';
import { useNavigate } from 'react-router-dom';
import DialogAddToCart from '../Cart/dialogAddToCart';
import { getCartItems } from '../../api/apiCartDetail';
import { toast } from 'react-toastify';

const SanPhamPage = () => {
  const [sanPhamList, setSanPhamList] = useState([]);
  const [selectedSanPham, setSelectedSanPham] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const sanPhamPerPage = 12;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
 const [cartItems, setCartItems] = useState([]);
 const [cartUpdateTrigger, setCartUpdateTrigger] = useState(0);
 const [dialogMode, setDialogMode] = useState('add'); // 'add' hoặc 'buy'


 useEffect(() => {
  fetchCartData();
}, [cartUpdateTrigger]);


  // Hàm fetch lại giỏ hàng (bạn có thể gọi sau khi thêm thành công)
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
    // Load giỏ hàng khi component mount
    fetchCartData();
  }, []);
  const goToCartPage = () => {
    navigate('/cart');
  };
  // Khi mở dialog
  const handleOpenDialog = (sp) => {
    setSelectedSanPham(sp);
    setOpenDialog(true);
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
  event.stopPropagation(); // ngăn sự kiện click nổi lên phần tử cha
  const isLoggedIn = !!localStorage.getItem('khachHang');
  if (!isLoggedIn) {
    navigate('/login');
  } else {
    setSelectedSanPham(sp); // gán sản phẩm được chọn
    setOpenDialog(true);    // mở dialog
  }
};




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
              onClick={(e) => {
                handleMuaNgay(e, sp);
                setDialogMode('buy');
              }}
            >
              Mua ngay
            </button>


                        <FaShoppingCart
                        className="cart-icon"
                        onClick={() => {
                          setSelectedSanPham(sp);
                          setOpenDialog(true);
                          setDialogMode('add');
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
        {openDialog && selectedSanPham && (
        <DialogAddToCart
          sanPham={selectedSanPham}
          mode={dialogMode}
          onClose={() => setOpenDialog(false)}
          fetchCartData={fetchCartData} // truyền hàm fetch lại giỏ hàng
          setCartUpdateTrigger={setCartUpdateTrigger}
        />
      )}

      {/* <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)}>
        <p>Giỏ hàng trống.</p>
      </CartSidebar> */}
    </div>
  );
};

export default SanPhamPage;
