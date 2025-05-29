export const registerKhachHang = async (khachHangData) => {
    const apiUrl = 'https://localhost:7265/api/KhachHang/DangKy'; // URL API đăng ký khách hàng
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(khachHangData), // Gửi dữ liệu khách hàng dưới dạng JSON
      });
  
      if (!response.ok) {
        throw new Error('Lỗi khi đăng ký khách hàng');
      }
  
      const data = await response.json();
      return data; // Trả về dữ liệu sau khi đăng ký thành công
    } catch (error) {
      console.error('Error registering KhachHang:', error);
      throw error; // Ném lỗi nếu có
    }
  };
  
  export const getKhachHangByMa = async (maKhachHang) => {
  const apiUrl = `https://localhost:7265/api/KhachHang/${maKhachHang}`; // URL API lấy khách hàng theo mã

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Lỗi khi lấy thông tin khách hàng');
    }

    const data = await response.json();
    return data; // Trả về dữ liệu khách hàng
  } catch (error) {
    console.error('Error fetching KhachHang by ma:', error);
    throw error;
  }
};


export const checkTrungMaKhachHang = async (maKhachHang) => {
  const apiUrl = `https://localhost:7265/api/KhachHang/${maKhachHang}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Nếu status 200 tức là mã khách hàng tồn tại -> trùng
    if (response.ok) {
      return true;
    }
    // Nếu 404 tức là không tìm thấy mã -> không trùng
    if (response.status === 404) {
      return false;
    }

    throw new Error('Lỗi khi kiểm tra mã khách hàng');
  } catch (error) {
    console.error('Error checking duplicate maKhachHang:', error);
    throw error;
  }
};
export const checkTrungSoDienThoai = async (soDienThoai) => {
  const apiUrl = `https://localhost:7265/api/KhachHang/CheckSoDienThoai?soDienThoai=${encodeURIComponent(soDienThoai)}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Lỗi khi kiểm tra số điện thoại');
    }

    const result = await response.json();

    // Nếu tồn tại số điện thoại => trả về true
    return result.TonTai === true;
  } catch (error) {
    console.error('Error checking duplicate soDienThoai:', error);
    throw error;
  }
};
