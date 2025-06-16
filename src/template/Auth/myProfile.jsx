import React, { useState } from 'react';
import {
  Card, Divider, Descriptions, Table,
  Badge, Avatar, Button, Tabs, Tag
} from 'antd';
import {
  CheckCircleOutlined, CloseCircleOutlined,
  UserOutlined, EditOutlined, SwapOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import './profile.css'; 

const { TabPane } = Tabs;

const MyProfile = () => {
  const [profile] = useState({
    tenKH: 'Nguyễn Văn A',
    maKH: 'KH001',
    email: 'nguyenvana@example.com',
    soDienThoai: '0123456789',
    diaChi: '123 Đường ABC, TP.HCM',
    ngaySinh: '1990-01-01',
    ngayDangKy: '2022-06-01',
    trangThai: 'Hoạt động',
    isEmailConfirmed: true,
    ghiChu: 'Khách hàng VIP',
  });

  const [pointsHistory] = useState([
    { maLSD: '1', ngay: '2024-01-01', diem: 10, loai: 'Tích', ghiChu: 'Mua hàng' },
    { maLSD: '2', ngay: '2024-02-01', diem: -5, loai: 'Tiêu', ghiChu: 'Đổi quà' },
  ]);

  const [orders] = useState([
    { maDH: 'DH001', ngay: '2024-05-01', trangThai: 'Đã đặt', tongTien: 500000 },
    { maDH: 'DH002', ngay: '2024-05-10', trangThai: 'Đang vận chuyển', tongTien: 300000 },
    { maDH: 'DH003', ngay: '2024-05-15', trangThai: 'Đã hủy', tongTien: 200000 },
    { maDH: 'DH004', ngay: '2024-05-20', trangThai: 'Đổi hàng', tongTien: 150000 },
  ]);

  const orderColumns = [
    { title: 'Mã đơn', dataIndex: 'maDH', key: 'maDH' },
    { title: 'Ngày', dataIndex: 'ngay', key: 'ngay' },
    { title: 'Tổng tiền', dataIndex: 'tongTien', key: 'tongTien', render: (t) => `${t.toLocaleString()} đ` },
    {
      title: 'Trạng thái', dataIndex: 'trangThai', key: 'trangThai', render: (trangThai) => {
        let color = 'blue';
        if (trangThai === 'Đang vận chuyển') color = 'orange';
        else if (trangThai === 'Đã hủy') color = 'red';
        else if (trangThai === 'Đổi hàng') color = 'purple';
        return <Tag color={color}>{trangThai}</Tag>;
      }
    },
  ];

  const profileTab = (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

      <Divider />

      <Descriptions column={1} bordered>
        <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
        <Descriptions.Item label="SĐT">{profile.soDienThoai}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">{profile.diaChi}</Descriptions.Item>
        <Descriptions.Item label="Ngày sinh">{new Date(profile.ngaySinh).toLocaleDateString()}</Descriptions.Item>
        <Descriptions.Item label="Ngày đăng ký">{new Date(profile.ngayDangKy).toLocaleDateString()}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {profile.trangThai === 'Hoạt động' ? (
            <Badge status="success" text="Hoạt động" />
          ) : (
            <Badge status="error" text="Không hoạt động" />
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Xác nhận email">
          {profile.isEmailConfirmed ? (
            <CheckCircleOutlined style={{ color: 'green' }} />
          ) : (
            <CloseCircleOutlined style={{ color: 'red' }} />
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Ghi chú">{profile.ghiChu || 'Không có'}</Descriptions.Item>
      </Descriptions>
    </motion.div>
  );

  const pointsTab = (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
      <Table
        className="my-table"
        dataSource={pointsHistory}
        columns={[
          { title: 'Ngày', dataIndex: 'ngay', key: 'ngay' },
          { title: 'Điểm', dataIndex: 'diem', key: 'diem' },
          { title: 'Loại', dataIndex: 'loai', key: 'loai' },
          { title: 'Ghi chú', dataIndex: 'ghiChu', key: 'ghiChu' },
        ]}
        rowKey="maLSD"
        pagination={{ pageSize: 5 }}
      />
    </motion.div>
  );

  const ordersTab = (status) => {
    const filtered = status ? orders.filter(o => o.trangThai === status) : orders;
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <Table
          className="my-table"
          dataSource={filtered}
          columns={orderColumns}
          rowKey="maDH"
          pagination={{ pageSize: 5 }}
        />
      </motion.div>
    );
  };

  return (
    <div className="my-profile-container">
        <div className="my-avatar-container">
        <Avatar size={120} icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
        <h3>{profile.tenKH}</h3> <p> 200 điểm </p>
        <div style={{ marginTop: 10 }}>
          <Button icon={<EditOutlined />} type="primary">Chỉnh sửa</Button>
        </div>
      </div>

      <Card className="my-card">
        <Tabs defaultActiveKey="1" centered animated className="my-tabs">
          <TabPane tab="Thông tin" key="1">{profileTab}</TabPane>
          <TabPane tab="Tích điểm" key="2">{pointsTab}</TabPane>
          <TabPane tab="Tất cả đơn hàng" key="3">{ordersTab()}</TabPane>
          <TabPane tab="Đơn đã đặt" key="4">{ordersTab('Đã đặt')}</TabPane>
          <TabPane tab="Đang vận chuyển" key="5">{ordersTab('Đang vận chuyển')}</TabPane>
          <TabPane tab="Đã hủy" key="6">{ordersTab('Đã hủy')}</TabPane>
          <TabPane tab="Đổi hàng" key="7" icon={<SwapOutlined />}>{ordersTab('Đổi hàng')}</TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default MyProfile;
