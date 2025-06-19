import React, { useState } from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../Auth/login.css'

const { Title } = Typography;

const AdminOtp = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleVerify = async () => {
    const stored = JSON.parse(localStorage.getItem('pendingAdminLogin'));

    if (!stored?.MaNV || !code) {
      return message.error('Thiếu mã nhân viên hoặc mã xác nhận');
    }

    try {
      // Gửi mã xác nhận lên backend để xác thực (chưa có API mẫu bạn cần tự viết)
      // Ví dụ API: /api/NhanVien/verifyadminotp
      const res = await fetch(`https://localhost:7265/api/NhanVien/verifyadminotp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maNV: stored.MaNV, code }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Xác nhận OTP thất bại');
      }

      const result = await res.json();
      message.success('Xác nhận OTP thành công');
      
      localStorage.setItem('adminInfo', JSON.stringify(result));
      navigate('/product-management');
    } catch (err) {
      message.error(err.message || 'Lỗi xác thực OTP');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <Title level={3} style={{ textAlign: 'center' }}>Xác minh mã OTP</Title>
        <p style={{ textAlign: 'center' }}>Vui lòng nhập mã đã gửi qua email</p>

        <Form onFinish={handleVerify} layout="vertical">
          <Form.Item label="Mã xác nhận">
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Nhập mã xác nhận" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AdminOtp;
