import { Link } from 'react-router-dom';
import { SettingOutlined } from '@ant-design/icons';

export const mobileMenuItems = [
  {
    key: '3',
    icon: <SettingOutlined />,
    label: 'Danh mục',
    children: [
      { key: '31', label: <Link to="/">Trang chủ</Link> },
      { key: '32', label: <Link to="/product">Sản phẩm</Link> },
      { key: '33', label: <Link to="/news">Tin tức</Link> },
      { key: '34', label: <Link to="/contact">Liên hệ</Link> },
      { key: '35', label: <Link to="/about">Giới thiệu</Link> },
    ],
  },
];
export default mobileMenuItems;