// src/template/Auth/Login.js

import React from 'react';
import { Button, Form, Input, Typography, Divider, message } from 'antd';
import { GoogleLogin } from '@react-oauth/google';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Logo } from '../../assets';
import { login } from '../../assets';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { loginKhachHang } from '../../api/login';
import { toast } from 'react-toastify';

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const khachHang = await loginKhachHang(values.username, values.password);
      toast.success('Đăng nhập thành công!');
  
      // Lưu thông tin khách hàng vào localStorage
      localStorage.setItem('khachHang', JSON.stringify(khachHang));
  
      // Chuyển đến trang chủ hoặc dashboard
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Đăng nhập thất bại');
    }
  };
  

  const handleGoogleSuccess = (credentialResponse) => {
    console.log('Google Login Success:', credentialResponse);
    message.success('Đăng nhập bằng Google thành công (giả lập)');
    // TODO: Gửi credentialResponse.credential đến backend để xác thực thật
  };

  const handleGoogleError = () => {
    message.error('Đăng nhập bằng Google thất bại');
  };

  return (
    <div className="login-container">
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
          Đăng nhập
        </Title>

        {/* Form đăng nhập */}
        <Form name="login-form" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Họ và tên"
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
          </Form.Item>

          <div style={{ textAlign: 'right', marginBottom: '12px' }}>
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        {/* Đăng nhập bằng Google */}
        <Divider>Hoặc</Divider>
        <div style={{ textAlign: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

        {/* Chuyển đến trang đăng ký */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span>Bạn chưa có tài khoản? </span>
          <Link to="/register">Đăng ký</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
