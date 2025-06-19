import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Select,
  Space,
  Popconfirm,
  message,
  TreeSelect
} from 'antd';
import {
  getAllLoaiSanPham,
  createLoaiSanPham,
  updateLoaiSanPham,
  deleteLoaiSanPham,
} from '../../api/loaiSanPhamApi'; // Cập nhật đường dẫn nếu khác

const { Search } = Input;
const { Option } = Select;

const LoaiSanPhamManagement = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Load all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllLoaiSanPham();
      setData(res);
      setFilteredData(res);
    } catch (err) {
      message.error('Không thể tải danh sách loại sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Tìm kiếm
  const handleSearch = (value) => {
    const filtered = data.filter((item) =>
      item.tenLoai.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Thêm hoặc cập nhật
  const handleSubmit = async (values) => {
    try {
      if (editingRecord) {
        await updateLoaiSanPham(editingRecord.maLoai, values);
        message.success('Cập nhật thành công');
      } else {
        await createLoaiSanPham(values);
        message.success('Thêm mới thành công');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingRecord(null);
      fetchData();
    } catch (err) {
      message.error('Lỗi khi lưu loại sản phẩm');
    }
  };

  // Xóa
  const handleDelete = async (id) => {
    try {
      await deleteLoaiSanPham(id);
      message.success('Xóa thành công');
      fetchData();
    } catch (err) {
      message.error('Không thể xóa. Có thể đang được sử dụng.');
    }
  };

  // Cột bảng
  const columns = [
    {
      title: 'Mã loại',
      dataIndex: 'maLoai',
      key: 'maLoai',
    },
    {
      title: 'Tên loại',
      dataIndex: 'tenLoai',
      key: 'tenLoai',
    },
    {
      title: 'Xuất xứ',
      dataIndex: 'xuatSu',
      key: 'xuatSu',
    },
    {
      title: 'Thuộc loại cha',
      dataIndex: 'parentId',
      key: 'parentId',
      render: (parentId) => parentId || 'Không có',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openEditModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.maLoai)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const openEditModal = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý loại sản phẩm</h2>
      <Space style={{ marginBottom: 16 }}>
        <Search placeholder="Tìm theo tên loại" onSearch={handleSearch} enterButton />
        <Button type="primary" onClick={openAddModal}>
          Thêm loại sản phẩm
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="maLoai"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingRecord ? 'Chỉnh sửa loại sản phẩm' : 'Thêm loại sản phẩm'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
        }}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Mã loại"
            name="maLoai"
            rules={[{ required: true, message: 'Vui lòng nhập mã loại' }]}
          >
            <Input disabled={!!editingRecord} />
          </Form.Item>

          <Form.Item
            label="Tên loại"
            name="tenLoai"
            rules={[{ required: true, message: 'Vui lòng nhập tên loại' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Xuất xứ" name="xuatSu">
            <Input />
          </Form.Item>

          <Form.Item label="Loại cha" name="parentId">
            <TreeSelect
              allowClear
              treeDefaultExpandAll
              placeholder="Chọn loại cha"
              treeData={data.map((item) => ({
                title: item.tenLoai,
                value: item.maLoai,
                key: item.maLoai,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LoaiSanPhamManagement;
