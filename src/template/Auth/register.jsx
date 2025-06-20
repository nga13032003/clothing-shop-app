import React from 'react';
import { Button, Form, Input, Typography, Divider, message } from 'antd';
import { LockOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Logo } from '../../assets';
import { login } from '../../assets';
import { toast } from 'react-toastify';
import './login.css';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate từ react-router-dom
import { checkTrungMaKhachHang, checkTrungSoDienThoai, registerKhachHang } from '../../api/register';
import { GoogleLogin } from '@react-oauth/google';

const { Title } = Typography;

const Register = () => {
  const navigate = useNavigate();

  // Tạo mã khách hàng KHxxxxx
  const generateMaKH = () => {
    const random = Math.floor(Math.random() * 100000);
    return 'KH' + random.toString().padStart(5, '0');
  };

  // Tạo mã khách hàng duy nhất bằng cách check trùng mã
  const generateUniqueMaKH = async () => {
    let maKH;
    let isDuplicate = true;
    let tries = 0;

    while (isDuplicate && tries < 10) {
      maKH = generateMaKH();
      isDuplicate = await checkTrungMaKhachHang(maKH);
      tries++;
    }

    if (isDuplicate) {
      throw new Error('Không thể tạo mã khách hàng duy nhất, vui lòng thử lại.');
    }

    return maKH;
  };

  const onFinish = async (values) => {
  try {
    // Bước 1: Check số điện thoại
    const khachHangTonTai = await checkTrungSoDienThoai(values.phone); // Hàm này nên trả về null nếu không tồn tại, hoặc thông tin khách hàng nếu tồn tại

    let khachHangData;

    if (khachHangTonTai) {
      if (khachHangTonTai.email) {
        // Trường hợp đã có sdt và email → đã đăng ký
        toast.error("Tài khoản đã tồn tại. Vui lòng đăng nhập!");
        return;
      } else {
        // Trường hợp đã có sdt nhưng chưa có email → cập nhật thông tin
        khachHangData = {
          tenKH: values.username,
          matKhau: values.password,
          email: values.email,
          soDienThoai: values.phone,
          diaChi: '',
          maLoaiKH: "KHM"
        };
      }
    } else {
      // Chưa có sdt trong hệ thống → tạo mới khách hàng
      const maKH = await generateUniqueMaKH();
      khachHangData = {
        maKH,
        tenKH: values.username,
        matKhau: values.password,
        email: values.email,
        soDienThoai: values.phone,
        maLoaiKH: "KHM"
      };
    }

    const result = await registerKhachHang(khachHangData);

    toast.success('Đăng ký thành công! Chuyển sang đăng nhập...');
    setTimeout(() => navigate('/login'), 2000);
  } catch (error) {
    toast.error(error.message || 'Đăng ký thất bại, vui lòng thử lại!');
    console.error('Lỗi:', error);
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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to="/">
            <img src={Logo} alt="Logo" style={{ height: '80px', width: 'auto' }} />
          </Link>
        </div>
        <Title level={2} style={{ textAlign: 'center' }}>
          Đăng ký tài khoản
        </Title>

        <Form name="register-form" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Họ và tên"
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
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
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            logo="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            style={{ marginBottom: '10px' }}
          />

        </div>

        <div style={{ textAlign: 'center' }}>
          <p>Đã có tài khoản? <a href="/login">Đăng nhập</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
