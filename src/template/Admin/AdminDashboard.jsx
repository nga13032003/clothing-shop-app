import React from 'react';
import { Layout, Menu } from 'antd';
import {
  AppstoreOutlined,
  TagsOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../assets';

const { Header, Sider, Content } = Layout;

const AdminDashboard = ({ children }) => {
  const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      localStorage.removeItem('adminInfo');
      navigate('/');
    } else {
      navigate(`/${key}`);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div className="logo" style={{ color: '#fff', textAlign: 'center', padding: '16px' }}>
          <img alt="Logo" src={Logo} />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['product-management']}
          onClick={handleMenuClick}
          items={[
            {
              key: 'product-management',
              icon: <AppstoreOutlined />,
              label: 'Quản lý sản phẩm',
            },
            {
              key: 'category-management',
              icon: <TagsOutlined />,
              label: 'Quản lý loại sản phẩm',
            },
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: 'Đăng xuất',
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', paddingLeft: 20 }}>
          <h2 style={{ margin: 0 }}>Bảng điều khiển quản trị</h2>
        </Header>

        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
