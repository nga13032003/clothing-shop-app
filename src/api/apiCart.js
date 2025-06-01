const API_BASE = 'https://localhost:7265/api/GioHang'; // Thay `port` bằng đúng cổng API của bạn

// GET: Lấy giỏ hàng theo mã khách hàng
export const getGioHangByKhachHang = async (maKhachHang) => {
  const response = await fetch(`${API_BASE}/khachhang/${maKhachHang}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Không thể lấy giỏ hàng.');
  }
  return response.json();
};

// POST: Thêm giỏ hàng mới
export const createGioHang = async (gioHang) => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gioHang),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Không thể tạo giỏ hàng.');
  }

  return response.json();
};

// PUT: Cập nhật giỏ hàng theo mã
export const updateGioHang = async (maGioHang, updatedGioHang) => {
  const response = await fetch(`${API_BASE}/${maGioHang}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedGioHang),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Không thể cập nhật giỏ hàng.');
  }

  return true;
};

// DELETE: Xóa giỏ hàng theo mã
export const deleteGioHang = async (maGioHang) => {
  const response = await fetch(`${API_BASE}/${maGioHang}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Không thể xóa giỏ hàng.');
  }

  return true;
};

// GET: Kiểm tra giỏ hàng có tồn tại
export const checkExistGioHang = async (maGioHang) => {
  const response = await fetch(`${API_BASE}/exist/${maGioHang}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Không thể kiểm tra giỏ hàng.');
  }

  return response.json(); // true hoặc false
};
