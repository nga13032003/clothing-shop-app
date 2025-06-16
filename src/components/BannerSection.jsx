import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'antd';
import {
  banner1, banner2, banner3, bannercontent1, bannerKM,
} from '../../assets';
import { getAllSanPham } from '../../api/apiSanPham';  // import API

const { Meta } = Card;

const BannerSection = () => {
  const banners = [banner1, banner2, banner3];
  const [currentBanner, setCurrentBanner] = useState(0);
  const [sanPhamList, setSanPhamList] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    async function fetchSanPham() {
      try {
        const data = await getAllSanPham();
        setSanPhamList(data);
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
      }
    }
    fetchSanPham();
  }, []);

  return (
    <div className="banner-section">
      {/* Banner Carousel */}
      <div className="banner-carousel">
        <img alt="Banner" src={banners[currentBanner]} className="banner-image" />
      </div>

      {/* Banner Content with Text */}
      <div className="banner-content">
        {/* ... phần nội dung text và ảnh ... */}
      </div>

      {/* Banner Khuyến Mãi */}
      <div className="banner-carousel">
        <img alt="Banner Khuyến Mãi" src={bannerKM} style={{ width: '100%', objectFit: 'cover' }} />
      </div>

      {/* Card Section */}
      <div className="card-section">
        <h3>Fasic – Thời Trang Tối Giản, Vẻ Đẹp Từ Những Điều Cơ Bản</h3>
        <Row gutter={[16, 16]} justify="center">
          {sanPhamList.slice(0, 3).map((sanPham) => (
            <Col key={sanPham.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                style={{ width: '100%' }}
                cover={<img alt={sanPham.tenSP} src={sanPham.hinhAnh} />}
              >
                <Meta title={sanPham.tenSP} description={sanPham.moTa} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default BannerSection;
