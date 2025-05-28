import React, { useEffect, useState } from 'react';
import './loaiSanPham.css';
import { getAllLoaiSanPham } from '../../api/loaiSanPhamApi';

const LoaiSanPhamMenu = () => {
  const [loaiSP, setLoaiSP] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getAllLoaiSanPham();
      const loaiCha = data.filter(item => item.parentId === null);

      // Gắn danh sách loại con cho từng loại cha
      const loaiWithChildren = loaiCha.map(loai => ({
        ...loai,
        children: data.filter(child => child.parentId === loai.maLoai)
      }));

      setLoaiSP(loaiWithChildren);
    }

    fetchData();
  }, []);

  return (
    <div className="dropdown-container">
      <div className="menu-grid">
        {loaiSP.map(loai => (
          <div key={loai.maLoai} className="category-column">
            <h4 className="category-title">{loai.tenLoai}</h4>
            {loai.children && loai.children.map(child => (
              <div key={child.maLoai} className="sub-category-item">
                - {child.tenLoai}
              </div>
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
