import React from 'react';
import { Button, Form, Input, Typography, Divider } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Logo } from '../../assets';
import { login } from '../../assets';
import { Link, useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../api/apiAdmin';
import { toast } from 'react-toastify';
import '../Auth/login.css'

const { Title } = Typography;

const LoginAdmin = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const adminData = await loginAdmin(values.username, values.password);

      toast.success('Đăng nhập thành công!');
      
      // Lưu tạm thông tin để xác thực OTP
      localStorage.setItem('pendingAdminLogin', JSON.stringify(adminData));
        navigate('/verify-otp');

    } catch (error) {
      toast.error(error.message || 'Đăng nhập admin thất bại');
    }
  };

  return (
    <div className="login-container">
      <img src={login} alt="Background" className="login-bg" />

      <div className="login-box">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to="/">
            <img src={Logo} alt="Logo" style={{ height: '80px', width: 'auto' }} />
          </Link>
        </div>

        <Title level={2} style={{ textAlign: 'center' }}>
          Đăng nhập Quản trị viên
        </Title>

        <Form name="admin-login-form" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <Divider />
        <div style={{ textAlign: 'center' }}>
          <a href="/fasic.vn">Quay lại trang người dùng</a>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
