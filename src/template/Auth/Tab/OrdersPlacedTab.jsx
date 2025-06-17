// tabs/OrdersTab.jsx
import React from 'react';
import { Table, Tag } from 'antd';
import { motion } from 'framer-motion';

const orderColumns = [
  { title: 'Mã đơn', dataIndex: 'maDH', key: 'maDH' },
  { title: 'Ngày', dataIndex: 'ngay', key: 'ngay' },
  {
    title: 'Tổng tiền',
    dataIndex: 'tongTien',
    key: 'tongTien',
    render: (t) => `${t.toLocaleString()} đ`
  },
  {
    title: 'Trạng thái',
    dataIndex: 'trangThai',
    key: 'trangThai',
    render: (status) => {
      let color = 'blue';
      if (status === 'Đang vận chuyển') color = 'orange';
      else if (status === 'Đã hủy') color = 'red';
      else if (status === 'Đổi hàng') color = 'purple';
      return <Tag color={color}>{status}</Tag>;
    }
  }
];

const OrdersTab = ({ orders, status }) => {
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

export default OrdersTab;
