import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { Card, Row, Col, Button } from 'antd';
import './home.css'; // Import the CSS file
import { Link } from 'react-router-dom';
import { banner1, banner2, banner3, bannercontent1, bannercontent2, bannerKM, facebook, instagram, Logo, QA1, QA2, QA3 } from '../../assets';

const { Header, Footer, Content } = Layout;

const App = () => {
  const { Meta } = Card;
  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = [banner1, banner2, banner3];
  


  // Change the banner every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBanner((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, []);

  return (
    <Layout className="layout">
      {/* Header Section */}
      <Header className="header">
        {/* Logo */}
        <div className="logo">
          <img alt="Logo" src={Logo} />
          <span>FASIC</span>
        </div>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li>Trang chủ</li>
          <li><Link to="/loai-san-pham">Sản phẩm</Link></li>
          <li>Tin tức</li>
          <li>Liên hệ</li>
          <li>Giới thiệu</li>
        </ul>

        {/* Actions Section */}
        <div className="actions">
          <span className="hotline">
            HOTLINE: <strong>1800 6750</strong>
          </span>
          <span className="icon">👤</span>
          <Link to="/login" className="btn btn-login">Đăng nhập</Link>
          <Link to="/register" className="btn btn-register">Đăng ký</Link>
        </div>

      </Header>

      {/* Content Section */}
      <Content className="content">
        {/* Banner Carousel */}
        <div className="banner-carousel">
          <img alt="Banner" src={banners[currentBanner]} className="banner-image" />
        </div>

        {/* Banner Content with Text */}
        <div className="banner-content">
          <div className="content-item">
            <div className="content-text">
            <h3>Fasic – Thời Trang Tối Giản, Vẻ Đẹp Từ Những Điều Cơ Bản</h3>
            <p><br/>
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
          <div className="banner-carousel">
          <img alt="Banner Content 1" src={bannerKM} style={{ width: '100%', objectFit: 'cover' }} />

        </div>
        <div>
        <h3>Fasic – Thời Trang Tối Giản, Vẻ Đẹp Từ Những Điều Cơ Bản</h3>
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            hoverable
            style={{ width: '100%' }}
            cover={ <img alt="QA1" src={QA1} />}
          >
            <Meta title="Europe Street Beat" description="www.instagram.com" />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            hoverable
            style={{ width: '100%' }}
            cover={ <img alt="QA2" src={QA2} />}
          >
            <Meta title="The Great Outdoors" description="Explore beautiful landscapes and scenic views." />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            hoverable
            style={{ width: '100%' }}
            cover={ <img alt="QA3" src={QA3} />}
          >
            <Meta title="Discover The World" description="Join us to explore hidden gems around the globe." />
          </Card>
        </Col>
      </Row>
    </div>


        </div>
      </Content>

      {/* Footer Section */}
      <Footer className="footer">
      <div className="column">
        <h3>Thông tin</h3>
        <p>Về Fasic</p>
        <p>Điều khoản dịch vụ</p>
        <p>Chính sách bảo mật</p>
      </div>
      <div className="column">
        <h3>Số điện thoại & Liên hệ</h3>
        <p>Hotline: 0355 470 624</p>
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <img alt="Facebook" src={facebook} className="icon" /> Fasic.vn
          </a><br />

          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <img alt="Instagram" src={instagram} className="icon" /> Fasic.vn
          </a>
        </div>
      </div>
      <div className="column">
        <h3>Địa chỉ</h3>
        <p>145/11 Thạnh Xuân 52, Phường Thạnh Xuân, Quận 12, TP.HCM</p>
        <div className="map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.2897598811303!2d106.65673267590001!3d10.760151659543084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752e23b1269797%3A0xa6e52944eb8f03a2!2zMTQ1LzExIFRow6BuaCBYdcOibiA1MiwgVGjDoG5oIFh1w6JuLCBRdeG6rW4gMTIsIFRow6BuaCBwaOG7kSBI4bqjbSBNaW5oLCBWaWV0bmFt!5e0!3m2!1svi!2s!4v1684991152422!5m2!1svi!2s"
            title="Google Map"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </Footer>

    </Layout>
  );
};

export default App;
