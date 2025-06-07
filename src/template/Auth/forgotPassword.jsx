import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Logo } from '../../assets';
import { login } from '../../assets';
import './login.css';
import { Link } from 'react-router-dom';
import { forgotPasswordKhachHang } from '../../api/login';
import { toast } from 'react-toastify';

const { Title } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const resMessage = await forgotPasswordKhachHang(values.email);
      toast.success(resMessage || 'Đã gửi email đặt lại mật khẩu thành công');
    } catch (error) {
      toast.error(error.message || 'Gửi email đặt lại mật khẩu thất bại');
    } finally {
      setLoading(false);
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
          Quên mật khẩu
        </Title>

        <Form name="forgot-form" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Nhập email của bạn" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Gửi liên kết đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/login">Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
