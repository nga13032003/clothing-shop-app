// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//   CheckCircleOutlined,
//   ClockCircleOutlined,
//   TruckOutlined,
//   ShopOutlined,
//   FileDoneOutlined,
// } from '@ant-design/icons';
// import './OrderSuccessPage.css';
// import confetti from 'canvas-confetti';

// const chiTietDonHang = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const order =
//     location.state?.order ||
//     JSON.parse(localStorage.getItem('orders'))?.slice(-1)[0] ||
//     null;

//   const [orderStatus, setOrderStatus] = useState([
//     {
//       status: 'Đặt hàng thành công',
//       timestamp: order?.timestamp || new Date().toISOString(),
//       active: true,
//       icon: <CheckCircleOutlined />,
//     },
//     {
//       status: 'Đang xử lý',
//       timestamp: null,
//       active: false,
//       icon: <ClockCircleOutlined />,
//     },
//     {
//       status: 'Đang giao hàng',
//       timestamp: null,
//       active: false,
//       icon: <TruckOutlined />,
//     },
//     {
//       status: 'Đã giao hàng',
//       timestamp: null,
//       active: false,
//       icon: <FileDoneOutlined />,
//     },
//   ]);

//   useEffect(() => {
//     // Confetti animation
//     confetti({
//       particleCount: 100,
//       spread: 70,
//       origin: { y: 0.6 },
//       colors: ['#3b82f6', '#22c55e', '#f97316'],
//     });

//     // Simulate status updates
//     const timers = [
//       setTimeout(() => {
//         setOrderStatus((prev) =>
//           prev.map((item, index) =>
//             index === 1
//               ? { ...item, active: true, timestamp: new Date().toISOString() }
//               : item
//           )
//         );
//       }, 2000),
//       setTimeout(() => {
//         setOrderStatus((prev) =>
//           prev.map((item, index) =>
//             index === 2
//               ? { ...item, active: true, timestamp: new Date().toISOString() }
//               : item
//           )
//         );
//       }, 4000),
//       setTimeout(() => {
//         setOrderStatus((prev) =>
//           prev.map((item, index) =>
//             index === 3
//               ? { ...item, active: true, timestamp: new Date().toISOString() }
//               : item
//           )
//         );
//       }, 6000),
//     ];

//     return () => timers.forEach((timer) => clearTimeout(timer));
//   }, []);

//   if (!order) {
//     return (
//       <div className="order-success-container">
//         <div className="order-error">
//           <p className="order-error-text">Không tìm thấy thông tin đơn hàng.</p>
//           <button
//             className="order-button"
//             onClick={() => navigate('/san-pham')}
//           >
//             Quay lại mua sắm
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const formatDate = (isoString) => {
//     return new Date(isoString).toLocaleString('vi-VN', {
//       dateStyle: 'medium',
//       timeStyle: 'short',
//     });
//   };

//   return (
//     <div className="order-success-container">
//       <div className="order-success-card">
//         <div className="order-header">
//           <CheckCircleOutlined className="order-success-icon" />
//           <h1 className="order-title">Đặt hàng thành công!</h1>
//           <p className="order-subtitle">
//             Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.
//           </p>
//           <p className="order-id">
//             Mã đơn hàng: <strong>{order.id}</strong>
//           </p>
//         </div>

//         <div className="order-status-section">
//           <h2 className="order-status-title">Trạng thái đơn hàng</h2>
//           <div className="order-timeline">
//             {orderStatus.map((status, index) => (
//               <div key={index} className="order-status-item">
//                 <div
//                   className={`order-status-icon ${
//                     status.active ? 'active' : ''
//                   }`}
//                 >
//                   {status.icon}
//                 </div>
//                 <div className="order-status-content">
//                   <p
//                     className={`order-status-text ${
//                       status.active ? 'active' : ''
//                     }`}
//                   >
//                     {status.status}
//                   </p>
//                   {status.timestamp && (
//                     <p className="order-status-time">
//                       {formatDate(status.timestamp)}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             ))}
//             <div className="order-timeline-line"></div>
//           </div>
//         </div>

//         <div className="order-details">
//           <h2 className="order-details-title">Chi tiết đơn hàng</h2>
//           <div className="order-details-content">
//             <p>
//               <span className="order-detail-label">Sản phẩm:</span>{' '}
//               {order.productName}
//             </p>
//             <p>
//               <span className="order-detail-label">Tổng tiền:</span>{' '}
//               {order.total} VND
//             </p>
//             <p>
//               <span className="order-detail-label">Ngày đặt hàng:</span>{' '}
//               {formatDate(order.timestamp)}
//             </p>
//           </div>
//         </div>

//         <div className="order-actions">
//           <button
//             className="order-button"
//             onClick={() => navigate('/san-pham')}
//           >
//             Tiếp tục mua sắm
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default chiTietDonHang;
