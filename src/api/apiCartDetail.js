const API_BASE = 'https://localhost:7265/api/ChiTietGioHang'; // Thay "port" bằng đúng port bạn đang dùng

// GET: Lấy chi tiết giỏ hàng theo mã giỏ hàng
export const getCartItems = async (maGioHang) => {
  const response = await fetch(`${API_BASE}/${maGioHang}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Không thể lấy chi tiết giỏ hàng.');
  }
  return response.json(); // Trả về danh sách ChiTietGioHang
};
export const getMaBienThe = async (maSanPham, mauSac, kichThuoc) => {
  const url = `${API_BASE}/ma-bien-the?maSanPham=${encodeURIComponent(maSanPham)}&mauSac=${encodeURIComponent(mauSac)}&kichThuoc=${encodeURIComponent(kichThuoc)}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Không thể lấy mã biến thể.');
  }

  const data = await response.json();
  return data.maBienThe; // Trả về đúng { maBienThe: '...' }
};



// POST: Thêm sản phẩm vào giỏ hàng
export const addToCart = async (item) => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Thêm vào giỏ hàng thất bại.');
  }

  return response.text(); // Trả về thông báo từ server
};
// GET: Lấy thông tin chi tiết biến thể sản phẩm theo maBienThe
export const getBienTheTheoMaBienThe = async (maBienThe) => {
  const url = `${API_BASE}/bienthe/${encodeURIComponent(maBienThe)}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Không thể lấy chi tiết biến thể sản phẩm.');
  }

  return response.json(); // Trả về chi tiết biến thể (ChiTietSanPham)
};


// PUT: Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItemQuantity = async (item) => {
  const response = await fetch(API_BASE, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Cập nhật số lượng thất bại.');
  }

  return response.text();
};

// DELETE: Xóa một sản phẩm khỏi giỏ hàng
export const removeFromCart = async (maGioHang, maBienThe) => {
  const url = `${API_BASE}?maGioHang=${maGioHang}&maBienThe=${maBienThe}`;
  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Xóa sản phẩm khỏi giỏ thất bại.');
  }

  return response.text();
};
