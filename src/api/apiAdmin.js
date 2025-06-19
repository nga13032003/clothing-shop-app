export const loginAdmin = async (username, password) => {
  const apiUrl = `https://localhost:7265/api/NhanVien/loginadmin`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Đăng nhập admin thất bại');
    }

    const data = await response.json();
    return data; // Trả về thông tin admin nếu thành công
  } catch (error) {
    console.error('Lỗi đăng nhập Admin:', error);
    throw error;
  }
};
