import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'antd';
import {
  banner1, banner2, banner3, bannercontent1, bannerKM,
  QA1, QA2, QA3
} from '../../assets';

const { Meta } = Card;

const BannerSection = () => {
  const banners = [banner1, banner2, banner3];
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="banner-section">
      {/* Banner Carousel */}
      <div className="banner-carousel">
        <img alt="Banner" src={banners[currentBanner]} className="banner-image" />
      </div>

      {/* Banner Content with Text */}
      <div className="banner-content">
        <div className="content-item">
          <div className="content-text">
            <h3>Fasic – Thời Trang Tối Giản, Vẻ Đẹp Từ Những Điều Cơ Bản</h3>
            <p><br />
              Fasic là thương hiệu thời trang tối giản, mang đến cho bạn những sản phẩm không chỉ đẹp mà còn tiện dụng và dễ phối hợp. Chúng tôi tin rằng vẻ đẹp nằm trong sự đơn giản và tinh tế, vì vậy mỗi sản phẩm của Fasic đều được thiết kế với sự chú ý đến từng chi tiết nhỏ nhất.
              Fasic không chạy theo xu hướng – chúng tôi tạo ra không gian để bạn tự do thể hiện cá tính qua sự tối giản. Tại Fasic, mỗi thiết kế đều được chăm chút từ chất liệu cho đến từng đường may, với mục tiêu mang lại sự thoải mái, tinh tế và bền vững trong từng sản phẩm.
            </p><br />
            <p>
              Chúng tôi tin rằng thời trang không cần phải phức tạp để trở nên cuốn hút. Chính sự giản dị, hiện đại và tinh gọn là yếu tố giúp bạn nổi bật trong đám đông một cách tự nhiên. Các thiết kế của Fasic tập trung vào phom dáng chuẩn, màu sắc trung tính như trắng, đen, beige, và xám – dễ phối, dễ mặc và không bao giờ lỗi thời.
            </p><br />
            <p>
              Dù là trang phục công sở, dạo phố hay những buổi hẹn hò nhẹ nhàng, Fasic luôn đồng hành cùng bạn với phong cách thanh lịch và tinh gọn. Tất cả sản phẩm đều được làm từ chất liệu thân thiện với môi trường, mang đến cảm giác dễ chịu trong từng chuyển động.
            </p><br />
            <p>
              Hãy để Fasic trở thành lựa chọn đầu tiên trong tủ đồ của bạn – nơi bạn có thể là chính mình, theo cách tối giản và đầy chất riêng.
            </p>
          </div>
          <img alt="Banner Content 1" src={bannercontent1} className="content-image" />
        </div>
      </div>

      {/* Banner Khuyến Mãi */}
      <div className="banner-carousel">
        <img alt="Banner Khuyến Mãi" src={bannerKM} style={{ width: '100%', objectFit: 'cover' }} />
      </div>

      {/* Card Section */}
      <div className="card-section">
        <h3>Fasic – Thời Trang Tối Giản, Vẻ Đẹp Từ Những Điều Cơ Bản</h3>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              style={{ width: '100%' }}
              cover={<img alt="QA1" src={QA1} />}
            >
              <Meta title="Europe Street Beat" description="www.instagram.com" />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              style={{ width: '100%' }}
              cover={<img alt="QA2" src={QA2} />}
            >
              <Meta title="The Great Outdoors" description="Explore beautiful landscapes and scenic views." />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              style={{ width: '100%' }}
              cover={<img alt="QA3" src={QA3} />}
            >
              <Meta title="Discover The World" description="Join us to explore hidden gems around the globe." />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default BannerSection;
