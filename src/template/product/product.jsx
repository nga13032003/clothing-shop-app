import React from 'react';
import { Row, Col, Card, Typography, Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { QA1, QA2, QA3 } from '../../assets'; // Đảm bảo đường dẫn đúng

const { Title, Paragraph } = Typography;
const { Meta } = Card;

// Dummy data sản phẩm
const products = [
  {
    id: 1,
    name: 'Áo Thun Trơn Tối Giản',
    price: '299,000₫',
    image: <img alt="QA1" src={QA1} style={{ objectFit: 'cover', height: '350px', width: '100%' }} />,
    description: 'Chất liệu cotton co giãn, màu trắng tinh tế.',
    isNew: true,
  },
  {
    id: 2,
    name: 'Quần Tây Dáng Slim',
    price: '499,000₫',
    image: <img alt="QA2" src={QA2} style={{ objectFit: 'cover', height: '350px', width: '100%' }} />,
    description: 'Phong cách hiện đại, lịch sự.',
    isNew: false,
  },
  {
    id: 3,
    name: 'Sơ Mi Linen Cộc Tay',
    price: '399,000₫',
    image: <img alt="QA3" src={QA3} style={{ objectFit: 'cover', height: '350px', width: '100%' }} />,
    description: 'Mát mẻ, phù hợp mùa hè.',
    isNew: true,
  },
];

const ProductPage = () => {
  return (
    <div className="product-page" style={{ padding: '40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Title level={2}>Sản Phẩm Mới Nhất</Title>
        <Paragraph>Khám phá các thiết kế tối giản và tinh tế từ Fasic</Paragraph>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {products.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
            <Badge.Ribbon
              text="Mới"
              color="red"
              style={{ display: product.isNew ? 'block' : 'none' }}
            >
              <Card
                hoverable
                cover={product.image}
                actions={[
                  <ShoppingCartOutlined key="cart" />,
                ]}
              >
                <Meta
                  title={product.name}
                  description={
                    <>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>{product.price}</p>
                      <small>{product.description}</small>
                    </>
                  }
                />
              </Card>
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductPage;
