import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Form, Modal, Select, Upload, Checkbox, message, Card, Image, Space, Tag, Row, Col } from 'antd';
import { UploadOutlined, EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { createSanPham, deleteSanPham, getAllSanPham, updateSanPham } from '../../api/apiSanPham';
import { getAllNhaCungCap } from '../../api/nhaCungCapApi';
import { getAllLoaiSanPham } from '../../api/loaiSanPhamApi';
import { getBienTheTheoMaSP, createBienTheSanPham, updateBienTheSanPham, deleteBienTheSanPham, uploadBienTheImage } from '../../api/chiTietSanPhamApi';
import { toast } from 'react-toastify';

const { Option } = Select;

// Utility functions for generating unique IDs
const generateMaSanPham = () => `SP${Date.now()}`; // e.g., SP1697591234567
const generateMaBienThe = () => `BT${Date.now()}`; // e.g., BT1697591234567

const ProductManagement = () => {
  // State management
  const [sanPhams, setSanPhams] = useState([]);
  const [nhaCungCaps, setNhaCungCaps] = useState([]);
  const [loaiSanPhams, setLoaiSanPhams] = useState([]);
  const [isSanPhamModalVisible, setIsSanPhamModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isBienTheModalVisible, setIsBienTheModalVisible] = useState(false);
  const [editingSanPham, setEditingSanPham] = useState(null);
  const [editingBienThe, setEditingBienThe] = useState(null);
  const [selectedSanPham, setSelectedSanPham] = useState(null);
  const [bienThes, setBienThes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [sanPhamForm] = Form.useForm();
  const [bienTheForm] = Form.useForm();

  // Fetch data on mount
  useEffect(() => {
    fetchSanPhams();
    fetchNhaCungCaps();
    fetchLoaiSanPhams();
  }, []);

  // Fetch SanPham
  const fetchSanPhams = async () => {
    try {
      const data = await getAllSanPham();
      setSanPhams(data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách sản phẩm');
    }
  };

  // Fetch NhaCungCap
  const fetchNhaCungCaps = async () => {
    try {
      const data = await getAllNhaCungCap();
      setNhaCungCaps(data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách nhà cung cấp');
    }
  };

  // Fetch LoaiSanPham
  const fetchLoaiSanPhams = async () => {
    try {
      const data = await getAllLoaiSanPham();
      setLoaiSanPhams(data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách loại sản phẩm');
    }
  };

  // Fetch BienTheSanPham for details
  const fetchBienThes = async (maSanPham) => {
    try {
      const data = await getBienTheTheoMaSP(maSanPham);
      setBienThes(data);
    } catch (error) {
      message.error(`Lỗi khi tải biến thể cho sản phẩm ${maSanPham}`);
    }
  };

  // Show Detail Modal
  const showDetailModal = async (sanPham) => {
    setSelectedSanPham(sanPham);
    await fetchBienThes(sanPham.maSanPham);
    setIsDetailModalVisible(true);
  };

  // SanPham Modal Handlers
  const showSanPhamModal = (sanPham = null) => {
    setEditingSanPham(sanPham);
    setIsSanPhamModalVisible(true);
    if (sanPham) {
      sanPhamForm.setFieldsValue({ ...sanPham, trangThai: sanPham.trangThai === 1 });
      setFileList(sanPham.hinhAnh ? [{ uid: '-1', name: 'image.png', status: 'done', url: sanPham.hinhAnhUrl }] : []);
    } else {
      sanPhamForm.resetFields();
      sanPhamForm.setFieldsValue({ maSanPham: generateMaSanPham(), trangThai: true });
      setFileList([]);
    }
  };

  const handleSanPhamOk = async () => {
    try {
      const values = await sanPhamForm.validateFields();
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const response = await uploadBienTheImage(fileList[0].originFileObj);
        values.hinhAnh = response.fileName; // Use fileName from API response
      } else if (editingSanPham && fileList.length === 0) {
        values.hinhAnh = editingSanPham.hinhAnh; // Retain existing image
      } else {
        values.hinhAnh = '';
      }
      values.trangThai = values.trangThai ? 1 : 0;

      if (editingSanPham) {
        await updateSanPham(editingSanPham.maSanPham, values);
        message.success('Cập nhật sản phẩm thành công');
      } else {
        await createSanPham(values);
        message.success('Tạo sản phẩm thành công');
      }
      setIsSanPhamModalVisible(false);
      sanPhamForm.resetFields();
      setFileList([]);
      fetchSanPhams();
    } catch (error) {
      console.error('Error saving product:', error);
      message.error('Lỗi khi lưu sản phẩm');
    }
  };

  const handleSanPhamCancel = () => {
    setIsSanPhamModalVisible(false);
    sanPhamForm.resetFields();
    setFileList([]);
  };

  // BienThe Modal Handlers
  const showBienTheModal = (sanPham, bienThe = null) => {
    setEditingBienThe(bienThe);
    setSelectedSanPham(sanPham);
    setIsBienTheModalVisible(true);
    setIsDetailModalVisible(false); // Hide detail modal when opening variant modal
    if (bienThe) {
      bienTheForm.setFieldsValue({ ...bienThe, trangThai: bienThe.trangThai === 1 });
      setFileList(bienThe.hinhAnh ? [{ uid: '-1', name: 'image.png', status: 'done', url: bienThe.hinhAnh }] : []);
    } else {
      bienTheForm.resetFields();
      bienTheForm.setFieldsValue({ maBienThe: generateMaBienThe(), maSanPham: sanPham.maSanPham, trangThai: true });
      setFileList([]);
    }
  };

  const handleBienTheOk = async () => {
    try {
      const values = await bienTheForm.validateFields();
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const response = await uploadBienTheImage(fileList[0].originFileObj);
        values.hinhAnh = response.fileName;
      } else if (editingBienThe && fileList.length === 0) {
        values.hinhAnh = editingBienThe.hinhAnh;
      } else {
        values.hinhAnh = '';
      }
      values.trangThai = values.trangThai ? 1 : 0;

      if (editingBienThe) {
        await updateBienTheSanPham(editingBienThe.maBienThe, values);
        message.success('Cập nhật biến thể thành công');
      } else {
        await createBienTheSanPham(values);
        message.success('Tạo biến thể thành công');
      }
      setIsBienTheModalVisible(false);
      bienTheForm.resetFields();
      setFileList([]);
      setIsDetailModalVisible(true); // Reopen detail modal after saving variant
      fetchBienThes(selectedSanPham.maSanPham);
    } catch (error) {
      console.error('Error saving variant:', error);
      message.error('Lỗi khi lưu biến thể');
    }
  };

  const handleBienTheCancel = () => {
    setIsBienTheModalVisible(false);
    bienTheForm.resetFields();
    setFileList([]);
    setIsDetailModalVisible(true); // Reopen detail modal on cancel
  };

  const handleDetailModalCancel = () => {
    setIsDetailModalVisible(false);
    setBienThes([]);
    setSelectedSanPham(null);
  };

  const handleDeleteSanPham = async (maSanPham) => {
    try {
      await deleteSanPham(maSanPham);
      toast.success('Xóa sản phẩm thành công');
      fetchSanPhams();
    } catch (error) {
      toast.error('Lỗi khi xóa sản phẩm');
    }
  };

  const handleDeleteBienThe = async (maBienThe) => {
    try {
      await deleteBienTheSanPham(maBienThe);
      toast.success('Xóa biến thể thành công');
      fetchBienThes(selectedSanPham.maSanPham);
    } catch (error) {
      toast.error('Lỗi khi xóa biến thể');
    }
  };

  // Search handler
  const handleSearch = async () => {
    try {
      const data = await getAllSanPham();
      const filtered = data.filter(
        (item) =>
          (item.maSanPham.toLowerCase().includes(searchText.toLowerCase()) ||
           item.tenSanPham.toLowerCase().includes(searchText.toLowerCase())) &&
          (statusFilter === null || item.trangThai === statusFilter)
      );
      setSanPhams(filtered);
    } catch (error) {
      message.error('Lỗi khi tìm kiếm sản phẩm');
    }
  };

  // Table columns for SanPham
  const sanPhamColumns = [
    {
      title: 'Hình Ảnh',
      dataIndex: 'hinhAnhUrl',
      key: 'hinhAnhUrl',
      render: (text) => (
        <Image
          src={text || 'https://via.placeholder.com/100'}
          width={60}
          height={60}
          style={{ borderRadius: 8, objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          preview={!!text}
        />
      ),
    },
    { title: 'Mã Sản Phẩm', dataIndex: 'maSanPham', key: 'maSanPham' },
    { title: 'Tên Sản Phẩm', dataIndex: 'tenSanPham', key: 'tenSanPham' },
    { title: 'Mô Tả', dataIndex: 'moTa', key: 'moTa', ellipsis: true },
    {
      title: 'Loại Sản Phẩm',
      dataIndex: 'maLoai',
      key: 'maLoai',
      render: (maLoai) => loaiSanPhams.find((loai) => loai.maLoai === maLoai)?.tenLoai || maLoai,
    },
    {
      title: 'Nhà Cung Cấp',
      dataIndex: 'maNCC',
      key: 'maNCC',
      render: (maNCC) => nhaCungCaps.find((ncc) => ncc.maNCC === maNCC)?.tenNCC || maNCC,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? 'Hoạt động' : 'Dừng hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => showDetailModal(record)} />
          <Button icon={<EditOutlined />} onClick={() => showSanPhamModal(record)} />
          <Button icon={<PlusOutlined />} onClick={() => showBienTheModal(record)}/>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteSanPham(record.maSanPham)} />
        </Space>
      ),
    },
  ];

  // Table columns for BienTheSanPham
  const bienTheColumns = [
    { title: 'Mã Biến Thể', dataIndex: 'maBienThe', key: 'maBienThe' },
    {
      title: 'Hình Ảnh',
      dataIndex: 'hinhAnh',
      key: 'hinhAnh',
      render: (text) => (
        <Image
          src={text || 'https://via.placeholder.com/50'}
          width={50}
          height={50}
          style={{ borderRadius: 4, objectFit: 'cover' }}
          preview={!!text}
        />
      ),
    },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    { title: 'Màu Sắc', dataIndex: 'mauSac', key: 'mauSac' },
    { title: 'Giá Vốn', dataIndex: 'giaVon', key: 'giaVon', render: (value) => value.toLocaleString('vi-VN') },
    { title: 'Giá Bán', dataIndex: 'giaBan', key: 'giaBan', render: (value) => value.toLocaleString('vi-VN') },
    { title: 'Tồn Kho', dataIndex: 'tonKho', key: 'tonKho' },
    { title: 'Trọng Lượng', dataIndex: 'trongLuong', key: 'trongLuong' },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? 'Hoạt động' : 'Dừng hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showBienTheModal(selectedSanPham, record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteBienThe(record.maBienThe)} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5' }}>
      <Card
        title="Quản Lý Sản Phẩm"
        style={{ borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      >
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col>
            <Input
              placeholder="Tìm kiếm theo mã hoặc tên sản phẩm"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
          </Col>
          <Col>
            <Checkbox onChange={(e) => setStatusFilter(e.target.checked ? 1 : null)}>
              Chỉ hiển thị sản phẩm hoạt động
            </Checkbox>
          </Col>
          <Col>
            <Button type="primary" onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </Col>
          <Col>
            <Button type="primary" onClick={() => showSanPhamModal()}>
              Thêm Sản Phẩm
            </Button>
          </Col>
        </Row>
        <Table
          columns={sanPhamColumns}
          dataSource={sanPhams}
          rowKey="maSanPham"
          pagination={{ pageSize: 10 }}
          style={{ background: '#fff', borderRadius: 8 }}
        />
      </Card>

      {/* SanPham Add/Edit Modal */}
      <Modal
        title={editingSanPham ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}
        open={isSanPhamModalVisible}
        onOk={handleSanPhamOk}
        onCancel={handleSanPhamCancel}
        okText={editingSanPham ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        width={600}
      >
        <Form form={sanPhamForm} layout="vertical">
          <Form.Item
            name="maSanPham"
            label="Mã Sản Phẩm"
            rules={[{ required: true, message: 'Mã sản phẩm không được để trống' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="tenSanPham"
            label="Tên Sản Phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="moTa" label="Mô Tả">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="hinhAnh" label="Hình Ảnh">
            <Upload
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              listType="picture"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Tải Hình Ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="maLoai"
            label="Loại Sản Phẩm"
            rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm' }]}
          >
            <Select placeholder="Chọn loại sản phẩm" showSearch optionFilterProp="children">
              {loaiSanPhams.map((loai) => (
                <Option key={loai.maLoai} value={loai.maLoai}>
                  {loai.tenLoai}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="maNCC"
            label="Nhà Cung Cấp"
            rules={[{ required: true, message: 'Vui lòng chọn nhà cung cấp' }]}
          >
            <Select placeholder="Chọn nhà cung cấp" showSearch optionFilterProp="children">
              {nhaCungCaps.map((ncc) => (
                <Option key={ncc.maNCC} value={ncc.maNCC}>
                  {ncc.tenNCC}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="trangThai" label="Trạng Thái" valuePropName="checked">
            <Checkbox>Hoạt động</Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      {/* BienThe Add/Edit Modal */}
      <Modal
        title={editingBienThe ? 'Sửa Biến Thể' : 'Thêm Biến Thể'}
        open={isBienTheModalVisible}
        onOk={handleBienTheOk}
        onCancel={handleBienTheCancel}
        okText={editingBienThe ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        width={600}
      >
        <Form form={bienTheForm} layout="vertical">
          <Form.Item
            name="maBienThe"
            label="Mã Biến Thể"
            rules={[{ required: true, message: 'Mã biến thể không được để trống' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="maSanPham"
            label="Mã Sản Phẩm"
            rules={[{ required: true, message: 'Mã sản phẩm không được để trống' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="size"
            label="Size"
            rules={[{ required: true, message: 'Vui lòng nhập size' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mauSac"
            label="Màu Sắc"
            rules={[{ required: true, message: 'Vui lòng nhập màu sắc' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="hinhAnh" label="Hình Ảnh">
            <Upload
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              listType="picture"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Tải Hình Ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="barcode" label="Barcode">
            <Input />
          </Form.Item>
          <Form.Item
            name="giaVon"
            label="Giá Vốn"
            rules={[{ required: true, message: 'Vui lòng nhập giá vốn' }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item
            name="giaBan"
            label="Giá Bán"
            rules={[{ required: true, message: 'Vui lòng nhập giá bán'}]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item
            name="tonKho"
            label="Tồn Kho"
            rules={[{ required: true, message: 'Vui lòng nhập tồn kho'}]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item name="trongLuong" label="Trọng Lượng">
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item name="trangThai" label="Trạng Thái" valuePropName="checked">
            <Checkbox>Hoạt động</Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title={`Chi Tiết Sản Phẩm: ${selectedSanPham?.tenSanPham}`}
        open={isDetailModalVisible}
        onCancel={handleDetailModalCancel}
        footer={null}
        width={800}
      >
        {selectedSanPham && (
          <Card style={{ marginBottom: 16, borderRadius: 8 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Image
                  src={selectedSanPham.hinhAnhUrl || 'https://via.placeholder.com/200'}
                  width={200}
                  style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  preview={!!selectedSanPham.hinhAnhUrl}
                />
              </Col>
              <Col span={16}>
                <p><strong>Mã Sản Phẩm:</strong> {selectedSanPham.maSanPham}</p>
                <p><strong>Tên Sản Phẩm:</strong> {selectedSanPham.tenSanPham}</p>
                <p><strong>Mô Tả:</strong> {selectedSanPham.moTa || 'Không có mô tả'}</p>
                <p>
                  <strong>Loại Sản Phẩm:</strong>{' '}
                  {loaiSanPhams.find((loai) => loai.maLoai === selectedSanPham.maLoai)?.tenLoai ||
                    selectedSanPham.maLoai}
                </p>
                <p>
                  <strong>Nhà Cung Cấp:</strong>{' '}
                  {nhaCungCaps.find((ncc) => ncc.maNCC === selectedSanPham.maNCC)?.tenNCC ||
                    selectedSanPham.maNCC}
                </p>
                <p>
                  <strong>Trạng Thái:</strong>{' '}
                  <Tag color={selectedSanPham.trangThai === 1 ? 'green' : 'red'}>
                    {selectedSanPham.trangThai === 1 ? 'Hoạt động' : 'Dừng hoạt động'}
                  </Tag>
                </p>
              </Col>
            </Row>
          </Card>
        )}
        <h3>Biến Thể Sản Phẩm</h3>
        <Table
            columns={bienTheColumns}
            dataSource={bienThes}
            rowKey="maBienThe"
            pagination={false}
            scroll={{ x: 'max-content' }}
            bordered
            size="middle"
            style={{
                backgroundColor: '#fff',
                borderRadius: 8,
                boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
                marginTop: 16,
            }}
            />

      </Modal>
    </div>
  );
};

export default ProductManagement;