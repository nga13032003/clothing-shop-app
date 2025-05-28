import React, { useEffect, useState } from 'react';
import { getAllLoaiSanPham } from '../../api/loaiSanPhamApi';
import {getSanPhamTheoLoaiSP} from '../../api/apiSanPham'
import { getBienTheTheoMaSP } from '../../api/chiTietSanPhamApi';

const SanPhamPage = () => {
  const [loaiSanPhamList, setLoaiSanPhamList] = useState([]);
  const [sanPhamTheoLoai, setSanPhamTheoLoai] = useState({});
  const [currentPages, setCurrentPages] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const loaiList = await getAllLoaiSanPham();
      setLoaiSanPhamList(loaiList);

      loaiList.forEach(async (loai) => {
        await fetchSanPham(loai.maLoai, 1);
      });
    };

    fetchData();
  }, []);

  const fetchSanPham = async (maLoai, page) => {
  const res = await getSanPhamTheoLoaiSP(maLoai, page);

  const sanPhamsWithGia = [];

  // Duyệt từng sp, lấy biến thể, nếu có thì push vào mảng mới
  for (const sp of res) {
    try {
      const bienThe = await getBienTheTheoMaSP(sp.maSP);

      // Nếu có biến thể (mảng không rỗng)
      if (bienThe.length > 0) {
        sanPhamsWithGia.push({
          ...sp,
          giaBan: bienThe[0].giaBan,
          hinhAnh: bienThe[0].hinhAnh,
        });
      }
      // Nếu bienThe rỗng thì không thêm sp này
    } catch (error) {
      // Nếu lỗi (ví dụ 404 biến thể ko tồn tại), bỏ qua sản phẩm này
      // Không cần ném lỗi ra nữa
      console.warn(`Không có biến thể cho sản phẩm mã ${sp.maSP}, bỏ qua.`);
    }
  }

  setSanPhamTheoLoai((prev) => ({
    ...prev,
    [maLoai]: sanPhamsWithGia,
  }));

  setCurrentPages((prev) => ({
    ...prev,
    [maLoai]: page,
  }));
};

  return (
    <div className="flex w-full max-w-[1440px] mx-auto">
      {/* Sidebar */}
      <aside className="w-1/4 p-4 border-r border-gray-300">
        {loaiSanPhamList.map((loai) => (
          <div key={loai.maLoai} className="mb-4">
            <p className="text-lg font-semibold lowercase">{loai.parentId}</p>
            <p className="ml-2">{loai.tenLoai}</p>
          </div>
        ))}
      </aside>

      {/* Main */}
      <main className="w-3/4 p-4">
        {loaiSanPhamList.map((loai) => (
          <div key={loai.maLoai} className="mb-10">
            <h2 className="text-xl font-bold mb-2">{loai.tenLoai}</h2>
            <div className="grid grid-cols-3 gap-4">
              {(sanPhamTheoLoai[loai.maLoai] || []).slice(0, 3).map((sp) => (
                <div key={sp.maSP} className="border rounded p-3 shadow">
                  <img src={sp.hinhAnh} alt={sp.tenSP} className="w-full h-60 object-cover mb-2" />
                  <p className="font-medium">{sp.tenSP}</p>
                  <p className="text-red-500 font-bold">{sp.giaBan.toLocaleString()}đ</p>
                </div>
              ))}
            </div>
            {/* Pagination */}
            <div className="mt-2">
              <button
                className="text-blue-500 mr-2"
                onClick={() => fetchSanPham(loai.maLoai, Math.max(1, (currentPages[loai.maLoai] || 1) - 1))}
              >
                Trang trước
              </button>
              <button
                className="text-blue-500"
                onClick={() => fetchSanPham(loai.maLoai, (currentPages[loai.maLoai] || 1) + 1)}
              >
                Trang sau
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default SanPhamPage;
