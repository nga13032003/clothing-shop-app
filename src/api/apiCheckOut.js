export async function getDiaChiKhachHang(maKH) {
  const response = await fetch(`https://localhost:7265/api/HoaDon/diachikhachhang/${maKH}`);
  if (!response.ok) throw new Error("Lấy địa chỉ khách hàng thất bại");
  return await response.json();
}
export async function getDonViVanChuyen() {
  const response = await fetch('https://localhost:7265/api/HoaDon/donvivanchuyen');
  if (!response.ok) throw new Error("Lấy danh sách đơn vị vận chuyển thất bại");
  return await response.json();
}

export async function getKhuyenMai() {
  const response = await fetch(`https://localhost:7265/api/HoaDon/khuyenmai`);
  if (!response.ok) throw new Error("Lấy danh sách khuyến mãi thất bại");
  return await response.json();
}

export async function getPhuongThucThanhToan() {
  const response = await fetch(`https://localhost:7265/api/HoaDon/phuongthucthanhtoan`);
  if (!response.ok) throw new Error("Lấy danh sách phương thức thanh toán thất bại");
  return await response.json();
}

// apiCheckOut.js
export async function datHang(orderData) {
  const API_URL = "https://localhost:7265/api/HoaDon/dathang";

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Nếu có token thì thêm Authorization
      // "Authorization": "Bearer " + token
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    let errorText = "Lỗi khi đặt hàng";
    try {
      const errorData = await response.json();
      errorText = errorData.message || errorText;
    } catch {}
    throw new Error(errorText);
  }

  const data = await response.json();
  return data; // { message, maHD }
}

export async function addDiaChiKhachHang(diaChiData) {
  const response = await fetch("https://localhost:7265/api/HoaDon/diachikhachhang", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(diaChiData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Lỗi khi thêm địa chỉ khách hàng");
  }

  return await response.json();
}
export async function updateDiaChiKhachHang(maDiaChi, diaChiData) {
  const response = await fetch(`https://localhost:7265/api/HoaDon/diachikhachhang/${maDiaChi}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(diaChiData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Lỗi khi cập nhật địa chỉ khách hàng");
  }

  return await response.json();
}
export async function deleteDiaChiKhachHang(maDiaChi) {
  const response = await fetch(`https://localhost:7265/api/HoaDon/diachikhachhang/${maDiaChi}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Lỗi khi xóa địa chỉ khách hàng");
  }

  return await response.json(); // Trả về { message: "Xóa địa chỉ thành công." }
}
export async function getAllChiTietHoaDon() {
  const response = await fetch("https://localhost:7265/api/HoaDon/chitiethoadon");
  if (!response.ok) {
    throw new Error("Lấy danh sách chi tiết hóa đơn thất bại");
  }
  return await response.json();
}

export async function getChiTietHoaDonTheoMaHD(maHD) {
  const response = await fetch(`https://localhost:7265/api/HoaDon/chitiethoadon/${maHD}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Không tìm thấy chi tiết hóa đơn");
  }
  return await response.json();
}
