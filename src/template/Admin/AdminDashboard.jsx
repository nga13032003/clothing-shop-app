import React from 'react';
import { Layout, Menu, Button, Typography } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { HomeOutlined, AppstoreOutlined, GiftOutlined, LogoutOutlined } from '@ant-design/icons';
// import './AdminDashboard.css';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear JWT token
    navigate('/clothing-shop-app/login'); // Redirect to login
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
  <p>Nga</p>
    </Layout>
  );
};

export default AdminDashboard;