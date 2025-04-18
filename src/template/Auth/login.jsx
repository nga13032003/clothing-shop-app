import React from 'react';
import { Button, Form, Input, Typography, Divider, message } from 'antd';
import { GoogleLogin } from '@react-oauth/google';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Logo } from '../../assets';
import { login } from '../../assets';
import './login.css'; 

const { Title } = Typography;

const Login = () => {
  const onFinish = (values) => {
    console.log('Form values:', values);
    message.success('Đăng nhập thành công (giả lập)');
  };

  const handleGoogleSuccess = (credentialResponse) => {
    console.log('Google Login Success:', credentialResponse);
    message.success('Đăng nhập bằng Google thành công (giả lập)');
  };

  const handleGoogleError = () => {
    message.error('Đăng nhập bằng Google thất bại');
  };

  return (
    <div className="login-container">
      <img src={login} alt="Background" className="login-bg" />
      <div className="login-box">
      <div style={{ display: 'flex', justifyContent: 'center'}}>
        <img src={Logo} alt="Logo" style={{ height: '80px', width: 'auto' }} />
        </div>
        <Title level={2} style={{ textAlign: 'center' }}>
          Đăng nhập
        </Title>

        <Form name="login-form" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập tên đăng nhập" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <Divider>Hoặc</Divider>

        <div style={{ textAlign: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
