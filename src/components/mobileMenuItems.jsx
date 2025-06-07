import { Link } from 'react-router-dom';
import { SettingOutlined } from '@ant-design/icons';

export const mobileMenuItems = [
  { key: '1', label: <Link to="/">Trang chủ</Link> },
  { key: '2', label: <Link to="/product">Sản phẩm</Link> },
  { key: '3', label: <Link to="/news">Tin tức</Link> },
  { key: '4', label: <Link to="/contact">Liên hệ</Link> },
  { key: '5', label: <Link to="/about">Giới thiệu</Link> },
];
export default mobileMenuItems;
