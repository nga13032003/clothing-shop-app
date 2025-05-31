import React, { useEffect, useState } from 'react';
import './loaiSanPham.css';
import { getAllLoaiSanPham } from '../../api/loaiSanPhamApi';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';


const LoaiSanPhamMenu = () => {
  const [loaiSP, setLoaiSP] = useState([]);

  useEffect(() => {
  async function fetchData() {
    try {
      const data = await getAllLoaiSanPham(); // data là mảng cây
      setLoaiSP(data);
    } catch (error) {
      console.error('Failed to fetch LoaiSanPham:', error);
    }
  }
  fetchData();
}, []);


  return (
    <div className="dropdown-container">
      <div className="menu-grid">
        {loaiSP.map(loai => (
          <div key={loai.maLoai} className="category-column">
            <h4 className="category-title">
              <Link to={`/san-pham/loai/${loai.maLoai}`} className="category-link">
                {loai.tenLoai}
              </Link>
            </h4>
            {loai.children && loai.children.map(child => (
              <Link key={child.maLoai} to={`/san-pham/loai/${child.maLoai}`} className="subcategory-link">
                <div className="sub-category-item">
                  <FaChevronRight style={{ marginRight: 4 }} />
                  {child.tenLoai}
                </div>
              </Link>
            ))}
          </div>
        ))}

        {/* Hình ảnh minh họa bên phải */}
        <div className="category-image">
          <img
            src="https://product.hstatic.net/1000392326/product/fas13854__w__798k_-_fjd51318__x__1098k__1__581e59ed3fa947f58b26a6f608270c08_master.jpg"
            alt="Chân váy Pantio"
            className="category-preview-img"
            />
        </div>
      </div>
    </div>
  );
};

export default LoaiSanPhamMenu;
