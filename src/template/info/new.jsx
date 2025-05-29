import React from 'react';
import { Row, Col, Card } from 'antd';
import { QA1, QA2, QA3 } from '../../assets';
import './new.css'

const { Meta } = Card;

const NewsPage = () => {
  return (
    <div className="news-page">
      <h2 className="page-title">Fasic – Thời Trang Tối Giản, Vẻ Đẹp Từ Những Điều Cơ Bản</h2>

      {/* Phần khuyến mãi sắp tới */}
      <section className="promotion-section">
        <h3 className="section-title">Khuyến Mãi Sắp Diễn Ra</h3>
        <ul className="promotion-list">
          <li>Giảm 20% toàn bộ áo sơ mi từ 01/06 - 10/06</li>
          <li>Mua 2 tặng 1 cho dòng sản phẩm quần jeans trong tuần này</li>
          <li>Miễn phí vận chuyển cho đơn hàng trên 1 triệu đồng</li>
        </ul>
      </section>

      {/* Phần tin tức shop */}
      <section className="news-section">
        <h3 className="section-title">Tin Tức Nổi Bật</h3>
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={<img alt="Tin tức 1" src={QA1} />}
              className="news-card"
            >
              <Meta
                title="Bộ Sưu Tập Hè 2025"
                description="Khám phá phong cách mới với những thiết kế tối giản và hiện đại."
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={<img alt="Tin tức 2" src={QA2} />}
              className="news-card"
            >
              <Meta
                title="Phong Cách Công Sở Đẳng Cấp"
                description="Lựa chọn hoàn hảo cho mùa hè năng động."
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={<img alt="Tin tức 3" src={QA3} />}
              className="news-card"
            >
              <Meta
                title="Xu Hướng Màu Sắc 2025"
                description="Tìm hiểu các tông màu được ưa chuộng trong năm nay."
              />
            </Card>
          </Col>
        </Row>
      </section>

      {/* Phần sản phẩm đang sale */}
      <section className="sale-section">
        <h3 className="section-title">Sản Phẩm Đang Sale</h3>
        <Row gutter={[24, 24]} justify="center">
          {/* Ví dụ sản phẩm sale, bạn có thể thay đổi tương tự */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={<img alt="Sản phẩm sale 1" src={QA1} />}
              className="sale-card"
            >
              <Meta
                title="Áo Thun Basic"
                description="Giảm giá 15%, chỉ còn 199k"
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={<img alt="Sản phẩm sale 2" src={QA2} />}
              className="sale-card"
            >
              <Meta
                title="Quần Jean Rách"
                description="Sale 25%, số lượng có hạn"
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={<img alt="Sản phẩm sale 3" src={QA3} />}
              className="sale-card"
            >
              <Meta
                title="Áo Khoác Mỏng"
                description="Giảm giá 30% nhân dịp hè"
              />
            </Card>
          </Col>
        </Row>
      </section>
    </div>
  );
};

export default NewsPage;
