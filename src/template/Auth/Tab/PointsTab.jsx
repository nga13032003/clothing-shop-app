import React from 'react';
import { Table } from 'antd';
import { motion } from 'framer-motion';

const PointsTab = ({ data }) => (
  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
    <Table
      className="my-table"
      dataSource={data}
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

export default PointsTab;
