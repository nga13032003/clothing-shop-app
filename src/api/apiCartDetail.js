const API_CART = 'https://localhost:7265/api/GioHang';
const API_CART_DETAIL = 'https://localhost:7265/api/ChiTietGioHang';

// 1. Lấy chi tiết giỏ hàng theo mã giỏ hàng (GET api/ChiTietGioHang/{maGioHang})
export const getCartItems = async (maGioHang) => {
  try {
    const res = await fetch(`${API_CART_DETAIL}/${maGioHang}`);
    if (!res.ok) throw new Error("Lỗi khi lấy chi tiết giỏ hàng");
    const data = await res.json();
    return Array.isArray(data) ? data : [];  
  } catch (err) {
    console.error(err);
    return []; 
  }
};


// 2. Lấy mã biến thể theo params (GET api/ChiTietGioHang/ma-bien-the?maSanPham=...&mauSac=...&kichThuoc=...)
export const getMaBienThe = async (maSanPham, mauSac, kichThuoc) => {
  const url = `${API_CART_DETAIL}/ma-bien-the?maSanPham=${encodeURIComponent(maSanPham)}&mauSac=${encodeURIComponent(mauSac)}&kichThuoc=${encodeURIComponent(kichThuoc)}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Không thể lấy mã biến thể.');
  }
  const data = await response.json();
  return data.maBienThe;
};

// 3. Thêm sản phẩm vào giỏ hàng (POST api/GioHang/addToCart)
export const addToCart = async (item) => {
  const response = await fetch(`${API_CART_DETAIL}/addToCart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Thêm vào giỏ hàng thất bại.');
  }

  return response.json(); // Trả về object chứa thông tin giỏ hàng và chi tiết vừa thêm
};

// 4. Lấy chi tiết biến thể sản phẩm theo mã biến thể (GET api/ChiTietGioHang/bienthe/{maBienThe})
export const getBienTheTheoMaBienThe = async (maBienThe) => {
  const url = `${API_CART_DETAIL}/bienthe/${encodeURIComponent(maBienThe)}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Không thể lấy chi tiết biến thể sản phẩm.');
  }
  return response.json();
};

// 5. Cập nhật số lượng sản phẩm trong giỏ hàng (PUT api/ChiTietGioHang)
export const updateCartItemQuantity = async (item) => {
  const response = await fetch(API_CART_DETAIL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Cập nhật số lượng thất bại.');
  }

  return response.text();
};

// 6. Xóa một sản phẩm khỏi giỏ hàng (DELETE api/ChiTietGioHang?maGioHang=...&maBienThe=...)
export const removeFromCart = async (maGioHang, maBienThe) => {
  const url = `${API_CART_DETAIL}?maGioHang=${encodeURIComponent(maGioHang)}&maBienThe=${encodeURIComponent(maBienThe)}`;
  const response = await fetch(url, { method: 'DELETE' });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Xóa sản phẩm khỏi giỏ thất bại.');
  }

  return response.text();
};
