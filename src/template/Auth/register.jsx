import React from 'react';
import { Button, Form, Input, Typography, Divider, message } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Logo } from '../../assets';
import { login } from '../../assets'; 
import './login.css'; 

const { Title } = Typography;

const Register = () => {
  const onFinish = (values) => {
    console.log('Register values:', values);
    message.success('Đăng ký thành công (giả lập)');
  };

  return (
    <div className="login-container">
      <img src={login} alt="Background" className="login-bg" />
      <div className="login-box">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src={Logo} alt="Logo" style={{ height: '80px', width: 'auto' }} />
        </div>
        <Title level={2} style={{ textAlign: 'center' }}>
          Đăng ký tài khoản
        </Title>

        <Form name="register-form" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập tên đăng nhập" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^\d{9,11}$/, message: 'Số điện thoại không hợp lệ!' },
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            label="Nhập lại mật khẩu"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <Divider>Hoặc</Divider>

        <div style={{ textAlign: 'center' }}>
          <p>Đã có tài khoản? <a href="/login">Đăng nhập</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
