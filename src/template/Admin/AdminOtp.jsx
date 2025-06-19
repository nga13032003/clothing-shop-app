import React, { useState } from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../Auth/login.css';

const { Title } = Typography;

const AdminOtp = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleVerify = async (values) => {
    const stored = JSON.parse(localStorage.getItem('pendingAdminLogin'));

    if (!stored?.MaNV || !values.code) {
      return message.error('Thiếu mã nhân viên hoặc mã xác nhận');
    }

    try {
      const res = await fetch('https://localhost:7265/api/NhanVien/verifyadminotp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ MaNV: stored.MaNV, Code: values.code }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Xác nhận OTP thất bại');
      }

      const result = await res.json();
      message.success('Xác nhận OTP thành công');
      
      localStorage.setItem('adminInfo', JSON.stringify(result));
      localStorage.removeItem('pendingAdminLogin');
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

        <Form form={form} onFinish={handleVerify} layout="vertical">
          <Form.Item
            label="Mã xác nhận"
            name="code"
            rules={[{ required: true, message: 'Vui lòng nhập mã xác nhận!' }]}
          >
            <Input placeholder="Nhập mã xác nhận" />
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