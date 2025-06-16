import React, { useEffect, useState } from "react";
import {
  Card,
  Rate,
  Avatar,
  Typography,
  Image,
} from "antd";
import {
  LikeOutlined,
  StarFilled,
  StarTwoTone,
} from "@ant-design/icons";

import "./DanhGia.css";

const { Title, Text } = Typography;

const mockData = [
  {
    id: 1,
    username: "yuqi2309",
    rating: 5,
    content: "Váy đẹp, tôn dáng...",
    category: "M - Trắng",
    helpfulCount: 15,
    images: [
      "https://localhost:7265/images/QA26.jpg",
      "https://localhost:7265/images/QA27.jpg",
    ],
  },
  {
    id: 2,
    username: "huongenguyyn054",
    rating: 5,
    content: "Đồ đẹp, đóng gói cẩn thận...",
    category: "L - Hồng",
    helpfulCount: 3,
    images: [
      "https://localhost:7265/images/QA29.jpg",
    ],
  },
];

const DanhGia = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    setFeedbacks(mockData);
  }, []);

  return (
    <div className="danhgia-container">
       <Title level={3} className="danhgia-title">
            <StarFilled style={{ color: "#f0ad4e" }} /> Đánh Giá Sản Phẩm ({feedbacks.length})
        </Title>
        <div className="danhgia-header-actions">
            <button className="danhgia-btn xem-tat-ca">
            Xem tất cả <span className="arrow">{'>'}</span>
            </button>
        </div>

      {/* Dùng div thay cho Col để card full width */}
      <div className="danhgia-list-vertical">
        {feedbacks.map(({ id, username, rating, content, category, helpfulCount, images }) => (
          <Card
            key={id}
            hoverable
            className="danhgia-card-fullwidth"
            style={{ animationDelay: `${id * 0.15}s`, width: "100%", marginBottom: 24 }}
          >
            <div className="danhgia-header">
              <div className="danhgia-user-info">
                <Avatar className="danhgia-avatar">{username.charAt(0).toUpperCase()}</Avatar>
                <Text className="danhgia-username">{username}</Text>
              </div>
              <div className="danhgia-rate-wrapper">
                <Rate disabled allowHalf defaultValue={rating} style={{ color: "#f0ad4e" }} />
              </div>
            </div>

            <Text type="secondary" className="danhgia-category">
              Phân loại: <b>{category}</b>
            </Text>

            <Text className="danhgia-category">{content}</Text>

            {images && images.length > 0 && (
              <div className="danhgia-images-col">
                {images.map((img, i) => (
                  <Image
                    key={i}
                    src={img}
                    alt={`feedback-${id}-${i}`}
                    className="danhgia-image"
                    preview={{ mask: <StarTwoTone twoToneColor="#f0ad4e" /> }}
                  />
                ))}
              </div>
            )}

            <div className="danhgia-helpful">
              <LikeOutlined /> Hữu ích ({helpfulCount})
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DanhGia;
