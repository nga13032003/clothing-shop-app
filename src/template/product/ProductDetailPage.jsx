import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSanPhamById } from '../../api/apiSanPham';
import { getBienTheTheoMaSP } from '../../api/chiTietSanPhamApi';
import './productDetail.css';
import { FaShoppingCart } from 'react-icons/fa';

const ProductDetailPage = () => {
  const { maSanPham } = useParams();
  const [sanPham, setSanPham] = useState(null);
  const [bienThes, setBienThes] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  // Lấy dữ liệu sản phẩm và biến thể
  useEffect(() => {
    async function fetchData() {
      try {
        const sp = await getSanPhamById(maSanPham);
        const btList = await getBienTheTheoMaSP(maSanPham);
        setSanPham(sp);
        setBienThes(btList);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [maSanPham]);

  // Khi có biến thể, chọn biến thể đầu tiên làm mặc định
  useEffect(() => {
    if (bienThes.length > 0) {
      const firstVariant = bienThes[0];
      setSelectedColor(firstVariant.mauSac);
      setSelectedSize(firstVariant.size);
      setSelectedVariant(firstVariant);
      setSelectedImageUrl(firstVariant.hinhAnhUrl || sanPham?.hinhAnhUrl || '');
    } else if (sanPham) {
      setSelectedImageUrl(sanPham.hinhAnhUrl || '');
    }
  }, [bienThes, sanPham]);

  // Khi chọn màu + size thì cập nhật biến thể + ảnh tương ứng
  useEffect(() => {
    if (selectedColor && selectedSize) {
      const matched = bienThes.find(
        (bt) => bt.mauSac === selectedColor && bt.size === selectedSize
      );
      if (matched) {
        setSelectedVariant(matched);
        setSelectedImageUrl(matched.hinhAnhUrl || sanPham?.hinhAnhUrl || '');
      }
    } else {
      setSelectedVariant(null);
    }
  }, [selectedColor, selectedSize, bienThes, sanPham]);

  // Lấy danh sách tất cả màu
  const allColors = [...new Set(bienThes.map(bt => bt.mauSac))];

  // Lọc size theo màu đã chọn
  const filteredSizes = selectedColor
    ? [...new Set(bienThes.filter(bt => bt.mauSac === selectedColor).map(bt => bt.size))]
    : [...new Set(bienThes.map(bt => bt.size))];

  // Lấy tất cả ảnh của biến thể (không chỉ theo màu)
  const variantImages = [...new Set(bienThes.map(bt => bt.hinhAnhUrl).filter(Boolean))];

  // Nếu không có ảnh biến thể, thêm ảnh mặc định từ sản phẩm
  if (variantImages.length === 0 && sanPham?.hinhAnhUrl) {
    variantImages.push(sanPham.hinhAnhUrl);
  }

  if (!sanPham) return <div>Đang tải sản phẩm...</div>;

    return (
    <div className="product-detail">
        <div className="product-layout">
        {/* Cột trái: Thông tin sản phẩm */}
       

        {/* Cột phải: Hình ảnh */}
        <div className="image-section">
            <div className="main-image-container">
            <img
                src={sanPham.hinhAnhUrl || selectedImageUrl}
                alt={sanPham.tenSanPham}
                className="main-image"
            />
            </div>
            <div className="thumbnail-container">
            {variantImages.map((imgUrl) => (
                <img
                key={imgUrl}
                src={imgUrl}
                alt="thumbnail"
                className={`thumbnail-image ${imgUrl === selectedImageUrl ? 'selected' : ''}`}
                onClick={() => {
                    setSelectedImageUrl(imgUrl);
                    const matched = bienThes.find(bt => bt.hinhAnhUrl === imgUrl);
                    if (matched) {
                    setSelectedVariant(matched);
                    setSelectedColor(matched.mauSac);
                    setSelectedSize(matched.size);
                    }
                }}
                />
            ))}
            </div>
        </div>
         <div className="info-section">
            <h2 className="product-title">{sanPham.tenSanPham}</h2>
            <p className="product-description">{sanPham.moTa}</p>

            {/* Chọn màu */}
            <div className="option-group">
            <label>Màu sắc:</label>
            <div className="options">
                {allColors.map((color) => (
                <button
                    key={color}
                    className={`option-button ${color === selectedColor ? 'selected' : ''}`}
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

            {/* Chọn size */}
            <div className="option-group">
            <label>Size:</label>
            <div className="options">
                {filteredSizes.map((size) => (
                <button
                    key={size}
                    className={`option-button ${size === selectedSize ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                >
                    {size}
                </button>
                ))}
            </div>
            </div>

            {/* Luôn hiện thông tin biến thể hoặc placeholder */}
            <div className="variant-info">
            {selectedVariant ? (
                <>
                <p><strong>Giá bán:</strong> {selectedVariant.giaBan.toLocaleString()} VND</p>
                <p><strong>Số lượng:</strong> {selectedVariant.tonKho}</p>
                <p><strong>Barcode:</strong> {selectedVariant.barcode}</p>
                </>
            ) : (
                <p className="placeholder">Vui lòng chọn màu sắc và size để xem chi tiết</p>
            )}
            
            </div>
            <br/>
            <div className="san-pham-actions">
                <button className="mua-ngay-button">Mua ngay</button>
                <FaShoppingCart className="cart-icon" />
            </div>
        </div>
        </div>
        
    </div>
    );


};

export default ProductDetailPage;
