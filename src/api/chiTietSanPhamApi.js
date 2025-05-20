const API_URL = 'https://localhost:7265/api/ChiTietSanPham';

// GET all ChiTietSanPham (not deleted)
export async function getAllChiTietSanPham() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Lỗi khi tải danh sách chi tiết sản phẩm');
    return await res.json();
}

// GET by ID
export async function getChiTietSanPhamById(id) {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error(`Không tìm thấy chi tiết sản phẩm có ID: ${id}`);
    return await res.json();
}

// POST: Create
export async function createChiTietSanPham(chiTiet) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(chiTiet),
    });
    if (!res.ok) throw new Error('Không thể tạo mới chi tiết sản phẩm');
    return await res.json();
}

// PUT: Update
export async function updateChiTietSanPham(id, chiTiet) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(chiTiet),
    });
    if (!res.ok) throw new Error('Không thể cập nhật chi tiết sản phẩm');
}

// DELETE: Soft delete
export async function deleteChiTietSanPham(id) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Không thể xóa chi tiết sản phẩm');
}

// POST: Upload hình ảnh
export async function uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) throw new Error('Tải ảnh thất bại');

    return await res.json(); // Trả về { imageUrl, fileName }
}

// GET: Theo mã loại sản phẩm
export async function getChiTietByMaLoaiSP(maLoaiSP) {
    const res = await fetch(`${API_URL}/loai/${maLoaiSP}`);
    if (!res.ok) throw new Error(`Không tìm thấy sản phẩm thuộc mã loại ${maLoaiSP}`);
    return await res.json();
}
export const getChiTietSanPhamTheoMaSP = async (maSanPham) => {
    try {
      const response = await fetch(`${API_URL}/sanpham/${maSanPham}`);
      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu từ server');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Lỗi khi fetch chi tiết sản phẩm:', error);
      return [];
    }
  };
  