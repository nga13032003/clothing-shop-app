import React, { useEffect, useState } from 'react';
import { getAllLoaiSanPham } from '../../api/loaiSanPhamApi';
import { getSanPhamTheoLoaiSP } from '../../api/apiSanPham';
import { getChiTietSanPhamTheoMaSP } from '../../api/chiTietSanPhamApi';

const PAGE_SIZE = 6;

const SanPhamMenu = () => {
  const [loaiSPList, setLoaiSPList] = useState([]);
  const [sanPhamList, setSanPhamList] = useState([]);
  const [hoveredLoaiId, setHoveredLoaiId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchLoaiSP = async () => {
      try {
        const loais = await getAllLoaiSanPham();
        setLoaiSPList(loais);
      } catch (error) {
        console.error('Lỗi khi lấy loại sản phẩm:', error);
      }
    };
    fetchLoaiSP();
  }, []);

  const handleLoaiClick = async (maLoai) => {
    setHoveredLoaiId(maLoai);
    setCurrentPage(1);
  
    try {
      const sanPhams = await getSanPhamTheoLoaiSP(maLoai);
  
      const sanPhamsWithChiTiet = await Promise.all(
        sanPhams.map(async (sp) => {
          try {
            const chiTiet = await getChiTietSanPhamTheoMaSP(sp.maSanPham);
            return {
              ...sp,
              hinhAnhUrl: chiTiet.hinhAnh,
              gia: chiTiet.gia,
              soLuong: chiTiet.soLuong
            };
          } catch {
            // Trả về null nếu không có chi tiết
            return null;
          }
        })
      );
  
      // Lọc bỏ sản phẩm null (không có chi tiết)
      const filteredSanPhams = sanPhamsWithChiTiet.filter((sp) => sp !== null);
  
      setSanPhamList(filteredSanPhams);
    } catch (error) {
      setSanPhamList([]);
    }
  };

  const paginatedProducts = sanPhamList.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const totalPages = Math.ceil(sanPhamList.length / PAGE_SIZE);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Danh mục sản phẩm</h2>

      <div className="flex flex-wrap gap-4 border-b pb-3 mb-6">
  {loaiSPList.map((loai) => (
    <button
      key={loai.maLoaiSP}
      onClick={() => handleLoaiClick(loai.maLoaiSP)}
      className={`px-5 py-2 text-base font-medium rounded-full border transition duration-200
        ${
          hoveredLoaiId === loai.maLoaiSP
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 hover:bg-blue-100 border-gray-300'
        }`}
    >
      {loai.tenLoaiSP}
    </button>
  ))}
</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paginatedProducts.length === 0 ? (
          <div className="col-span-3 text-gray-500 italic">
            Chọn một loại sản phẩm để xem danh sách.
          </div>
        ) : (
          paginatedProducts.map((sp) => (
            <div
              key={sp.maSanPham}
              className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-200"
            >
              <img
                src={ sp.hinhAnh ? `https://localhost:7265/images/${sp.hinhAnh}` : 'https://via.placeholder.com/300x200?text=No+Image'}
                alt={sp.tenSanPham}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-base mb-1">{sp.tenSanPham}</h3>
                <p className="text-sm text-gray-500 mb-1">Mã: {sp.maSanPham}</p>
                {sp.gia !== undefined && (
                  <p className="text-sm text-red-600 font-medium">Giá: {sp.gia.toLocaleString()} đ</p>
                )}
                {sp.soLuong !== undefined && (
                  <p className="text-sm text-gray-500">Tồn kho: {sp.soLuong}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
        >
          &laquo;
        </button>
        {[...Array(totalPages)].map((_, idx) => {
          const page = idx + 1;
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-1 rounded border transition duration-200 ${
                page === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 hover:bg-gray-200 border-gray-300'
              }`}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50"
        >
          &raquo;
        </button>
      </div>
      
      )}
    </div>
  );
};

export default SanPhamMenu;
