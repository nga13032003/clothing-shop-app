import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSanPhamTheoLoaiSP } from '../../api/apiSanPham';
import './sanpham.css'
import { FaShoppingCart } from 'react-icons/fa';

const SanPhamTheoLoai = () => {
  const { maLoai } = useParams();
  const [sanPham, setSanPham] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getSanPhamTheoLoaiSP(maLoai);
        setSanPham(data);
      } catch (error) {
        console.error('Không thể tải sản phẩm:', error);
      }
    }

    fetchData();
  }, [maLoai]);

  return (
     <div className="san-pham-theo-loai">
      <h2>Sản phẩm theo loại: {maLoai}</h2>
      <div className="san-pham-grid">
        {sanPham.map(sp => (
          <div
            key={sp.maSanPham}
            className="san-pham-item"
            onClick={() => navigate(`/product/${sp.maSanPham}`)}
          >
            <img src={sp.hinhAnhUrl || '/placeholder.jpg'} alt={sp.tenSanPham} />
            <h4>{sp.tenSanPham}</h4>
            <div className="san-pham-actions">
              <button className="mua-ngay-button">Mua ngay</button>
              <FaShoppingCart className="cart-icon" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SanPhamTheoLoai;
