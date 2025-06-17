import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { createGioHang, getGioHangByKhachHang } from '../../api/apiCart';
import { addToCart, getMaBienThe, getCartItems, updateCartItemQuantity } from '../../api/apiCartDetail';
import { getBienTheTheoMaSP } from '../../api/chiTietSanPhamApi';
import './dialogAddToCart.css';
import { useNavigate } from 'react-router-dom';


const DialogAddToCart = ({ sanPham, onClose, fetchCartData, setCartUpdateTrigger}) => {
  const [bienThes, setBienThes] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [soLuong, setSoLuong] = useState(1);

  const navigate = useNavigate();
  const [maKhachHang1, setMaKhachHang] = useState('');


  const generateRandomMaGioHang = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  // Giới hạn tăng số lượng theo tồn kho
const handleIncrease = () => {
  if (!selectedVariant) return;
  if (soLuong < selectedVariant.tonKho) {
    setSoLuong(prev => prev + 1);
  } else {
    toast.warning('Số lượng không thể vượt quá tồn kho');

  }
};
const handleDecrease = () => setSoLuong(prev => (prev > 1 ? prev - 1 : 1));


  // Lấy danh sách biến thể
  useEffect(() => {
    async function fetchVariants() {
      try {
        const list = await getBienTheTheoMaSP(sanPham.maSanPham);
        setBienThes(list);

        if (list.length > 0) {
          const first = list[0];
          setSelectedColor(first.mauSac);
          setSelectedSize(first.size);
          setSelectedVariant(first);
          setSelectedImageUrl(first.hinhAnh || sanPham.hinhAnh);
        }
      } catch (err) {
        console.error('Lỗi khi lấy biến thể:', err);
      }
    }
    fetchVariants();
  }, [sanPham]);
  // Khi chỉ chọn màu, cũng cập nhật ảnh đầu tiên có màu đó (kể cả chưa chọn size)
useEffect(() => {
  if (selectedColor && !selectedSize) {
    const firstMatch = bienThes.find((bt) => bt.mauSac === selectedColor);
    if (firstMatch) {
      setSelectedImageUrl(firstMatch.hinhAnh || sanPham.hinhAnh);
    }
  }
}, [selectedColor, selectedSize, bienThes, sanPham]);


  // Cập nhật variant khi chọn màu và size
  useEffect(() => {
    const found = bienThes.find(
      (bt) => bt.mauSac === selectedColor && bt.size === selectedSize
    );
    if (found) {
      setSelectedVariant(found);
      setSelectedImageUrl(found.hinhAnh || sanPham.hinhAnh);
    }
  }, [selectedColor, selectedSize, bienThes, sanPham]);

  const handleAddToCart = async () => {
  try {
    const khachHangStr = localStorage.getItem('khachHang');
    const khachHang = khachHangStr ? JSON.parse(khachHangStr) : null;
   if (!khachHang) {
      toast.warning("Vui lòng đăng nhập để mua hàng");
      return;
    }
    if (!selectedColor || !selectedSize || !selectedVariant) {
      toast.warning('Vui lòng chọn đầy đủ màu sắc và kích thước!');
      return;
    }


    // Lấy giỏ hàng hiện có của khách hàng
    let carts = await getGioHangByKhachHang(khachHang.maKH);

    // Lọc ra giỏ hàng đang hoạt động (trangThai === 1)
    if (Array.isArray(carts)) {
      carts = carts.filter(c => c.trangThai === 1);
    } else if (carts && carts.trangThai === 1) {
      carts = [carts];
    } else {
      carts = [];
    }

    let cart = carts.length > 0 ? carts[0] : null;

    // Nếu không có giỏ hàng thì tạo mới
    if (!cart || !cart.maGioHang) {
      const randomMaGioHang = generateRandomMaGioHang();
      const now = new Date().toISOString();

      const newCart = {
        maGioHang: randomMaGioHang,
        maKH: khachHang.maKH,
        ngayTao: now,
        ngayCapNhat: now,
        trangThai: 1,
      };

      await createGioHang(newCart);
      cart = newCart; // dùng luôn cái mới tạo này
    }

    // Lấy danh sách chi tiết giỏ hàng
    const res = await getCartItems(cart.maGioHang);
const cartItems = Array.isArray(res) ? res : res.data || [];
    const existingItem = cartItems.find(item => item.maBienThe === selectedVariant.maBienThe);

    if (existingItem) {
      // Nếu đã có sản phẩm trong giỏ, cập nhật số lượng
      const newQuantity = existingItem.soLuong + soLuong;
      await updateCartItemQuantity({
        maGioHang: cart.maGioHang,
        maBienThe: selectedVariant.maBienThe,
        soLuong: newQuantity,
      });
    } else {
      // Nếu chưa có thì thêm mới sản phẩm vào giỏ hàng
      await addToCart({
        maKhachHang: khachHang.maKH,
        maBienThe: selectedVariant.maBienThe,
        soLuong,
      });
    }

    if (fetchCartData) {
  await fetchCartData();
}
if (setCartUpdateTrigger) {
  setCartUpdateTrigger(prev => prev + 1); 
}
const updatedCartItems = await getCartItems(cart.maGioHang);
// Gán vào state hoặc làm gì đó với kết quả nếu cần
console.log('Cập nhật giỏ hàng mới:', updatedCartItems);


    toast.success('Thêm vào giỏ hàng thành công!');
    onClose();
  } catch (error) {
    console.error('Lỗi khi thêm vào giỏ:', error);
    toast.error(error.message || 'Không thể thêm vào giỏ hàng!');
  }
};



  const uniqueColors = [...new Set(bienThes.map(bt => bt.mauSac))];
  const filteredSizes = selectedColor
    ? [...new Set(bienThes.filter(bt => bt.mauSac === selectedColor).map(bt => bt.size))]
    : [];

  return (
    <div className="dialog-overlay">
      <div className="dialog-container">
        <button className="close-btn" onClick={onClose}>×</button>

        <div className="dialog-content">
          <div className="left-images">
            <img src={selectedImageUrl || sanPham.hinhAnhUrl}
              alt={sanPham.tenSanPham} className="main-img" />

          </div>

          <div className="right-details">
            <h2>{sanPham.tenSanPham}</h2>
            {selectedVariant ? (
              <p className="price">
                {selectedVariant.giaBan.toLocaleString()}₫
              </p>
            ) : (
              <p className="price">Chọn biến thể để xem giá</p>
            )}
            <p className="sanPham-code">Mã sản phẩm: {sanPham.maSanPham}</p>

            <div className="section">
              <span className="label">MÀU SẮC</span>
              <div className="color-options">
                {uniqueColors.map((color, idx) => (
                  <button
                    key={idx}
                    className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedColor(color);
                      setSelectedSize('');
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="section">
              <span className="label">KÍCH THƯỚC</span>
              <div className="size-options">
                {filteredSizes.map((size, idx) => (
                  <button
                    key={idx}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="section">
            <span className="label">SỐ LƯỢNG</span>
            <div className="quantity-control" style={{ flexDirection: 'row' }}>
                <button onClick={handleDecrease}>-</button>
                <input
                type="number"
                min="1"
                value={soLuong}
                onChange={(e) => setSoLuong(Math.max(1, parseInt(e.target.value) || 1))}
                />
                <button onClick={handleIncrease}>+</button>
            </div>
            </div>

            <button
                  className=" add-to-cart-btn w-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-2 rounded-md hover:from-pink-600 hover:to-red-600 transition-all"
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ
                </button>
                {/* <button
                  className="view-detail-btn w-full bg-gray-100 text-gray-800 py-2 rounded-md mt-2 hover:bg-gray-200 transition-all"
                  onClick={() => navigate(`/product/${sanPham.maSanPham}`)}
                >
                  Xem chi tiết
                </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogAddToCart;
