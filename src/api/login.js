export const loginKhachHang = async (email, matKhau) => {
    const apiUrl = `https://localhost:7265/api/KhachHang/DangNhap?email=${encodeURIComponent(email)}&matKhau=${encodeURIComponent(matKhau)}`;
  
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        // Lấy nội dung lỗi từ body nếu có
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Đăng nhập thất bại');
      }
  
      const data = await response.json();
      return data; // Trả về thông tin khách hàng nếu đăng nhập thành công
    } catch (error) {
      console.error('Error logging in KhachHang:', error);
      throw error;
    }
  };
  