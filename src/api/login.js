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
  
  export const forgotPasswordKhachHang = async (email) => {
  const apiUrl = `https://localhost:7265/api/KhachHang/ForgotPassword`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(email), // backend nhận [FromBody] string email
    });

    if (!response.ok) {
      // Lấy nội dung lỗi nếu có
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Gửi email đặt lại mật khẩu thất bại');
    }

    const data = await response.text(); // backend trả về string thông báo thành công
    return data;
  } catch (error) {
    console.error('Error in forgotPasswordKhachHang:', error);
    throw error;
  }
};
export async function resetPasswordKhachHang(email, token, password) {
  const response = await fetch('https://localhost:7265/api/KhachHang/ResetPassword', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      resetPasswordToken: token,
      matKhau: password
    }),
  });

  const data = await response.text(); // đọc dạng text

  if (!response.ok) {
    throw new Error(data || 'Đặt lại mật khẩu thất bại');
  }

  return data; // trả lại string "Đặt lại mật khẩu thành công."
}


