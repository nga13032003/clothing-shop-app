// src/template/Auth/ResetPassword.js

import React, { useState } from 'react';
import { Button, Form, Input, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPasswordKhachHang } from '../../api/login';
import { Logo } from '../../assets';
import { login } from '../../assets';
import { toast } from 'react-toastify';
import './login.css'; // Sử dụng lại CSS của Login

const { Title } = Typography;

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const resetPasswordToken = searchParams.get('token');
  const email = searchParams.get('email');

  const onFinish = async (values) => {
    if (!email || !resetPasswordToken) {
      toast.error('Thiếu thông tin email hoặc token.');
      return;
    }

    setLoading(true);
    try {
      await resetPasswordKhachHang(email, resetPasswordToken, values.password);
      toast.success('Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Đặt lại mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Ảnh nền giống Login */}
      <img src={login} alt="Background" className="login-bg" />

      <div className="login-box">
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to="/">
            <img src={Logo} alt="Logo" style={{ height: '80px', width: 'auto' }} />
          </Link>
        </div>

        {/* Tiêu đề */}
        <Title level={2} style={{ textAlign: 'center' }}>
          Đặt lại mật khẩu
        </Title>

        {/* Form đặt lại mật khẩu */}
        <Form name="reset-password-form" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu ít nhất 6 ký tự!' },
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu mới" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>

        {/* Link quay lại đăng nhập */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span>Đã nhớ mật khẩu? </span>
          <Link to="/login">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
