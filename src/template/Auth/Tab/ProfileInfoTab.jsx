import React from 'react';
import { Badge, Descriptions } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const ProfileInfoTab = ({ profile }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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

export default ProfileInfoTab;
