import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './checkout.css';
import { UserOutlined, EnvironmentOutlined, CreditCardOutlined, FileTextOutlined, EditOutlined } from '@ant-design/icons';

const mockSelectedCart = [
  {
    maBienThe: 'bt01',
    tenSanPham: 'Áo sơ mi công sở vải lụa tằm dáng suông cổ tròn nhún đính ngọc tạo kiểu tay dài phối măng séc',
    mauSac: 'Xanh',
    size: 'M',
    gia: 150000,
    soLuong: 2,
    hinhAnhUrl: 'https://localhost:7265/images/QA6.jpg',
  },
  {
    maBienThe: 'bt02',
    tenSanPham: 'Áo khoác vest công sở vải thô đũi dáng suông cổ hai ve thân áo đính khuy',
    mauSac: 'Xanh',
    size: 'L',
    gia: 350000,
    soLuong: 1,
    hinhAnhUrl: 'https://localhost:7265/images/QA7.jpg',
  },
];

const mockTransportOptions = [
  { id: 'ghn', name: 'Giao hàng nhanh', fee: 30000, estimatedDelivery: '2-3 ngày' },
  { id: 'ghtk', name: 'Giao hàng tiết kiệm', fee: 20000, estimatedDelivery: '3-5 ngày' },
  { id: 'vnp', name: 'Viettel Post', fee: 25000, estimatedDelivery: '2-4 ngày' },
];

const mockPromoCodes = [
  { code: 'GIAM20', discount: 20000, description: 'Giảm 20.000 ₫ cho đơn từ 200.000 ₫' },
  { code: 'FREESHIP', discount: 30000, description: 'Miễn phí vận chuyển' },
  { code: 'SALE10', discount: 10000, description: 'Giảm 10.000 ₫ cho mọi đơn hàng' },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [selectedCart, setSelectedCart] = useState([]);
  const [address, setAddress] = useState({
    fullName: 'Nguyễn Văn A',
    phone: '0912345678',
    city: 'Hồ Chí Minh',
    district: 'Quận 1',
    ward: 'Phường Bến Nghé',
    street: '123 Đường Lê Lợi',
    note: 'Giao giờ hành chính',
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [errors, setErrors] = useState({});
  const [promoCode, setPromoCode] = useState('');
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [showPromoDialog, setShowPromoDialog] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const [pointsDiscount, setPointsDiscount] = useState(0);
  const [availablePoints] = useState(500); // Giả lập điểm hiện tại
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [showTransportDialog, setShowTransportDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    setSelectedCart(mockSelectedCart);
    setSelectedTransport(mockTransportOptions[0]);
  }, []);

  const getTotalPrice = () => {
    return selectedCart.reduce((sum, item) => sum + item.soLuong * item.gia, 0);
  };

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};
    if (!address.fullName.trim()) newErrors.fullName = 'Họ tên không được để trống';
    if (!address.phone.trim()) newErrors.phone = 'Số điện thoại không được để trống';
    else if (!/^(0|\+84)[0-9]{9,10}$/.test(address.phone)) newErrors.phone = 'Số điện thoại không hợp lệ';
    if (!address.city.trim()) newErrors.city = 'Tỉnh/Thành phố không được để trống';
    if (!address.district.trim()) newErrors.district = 'Quận/Huyện không được để trống';
    if (!address.ward.trim()) newErrors.ward = 'Phường/Xã không được để trống';
    if (!address.street.trim()) newErrors.street = 'Địa chỉ cụ thể không được để trống';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyPromo = () => {
    if (selectedPromo) {
      setDiscount(selectedPromo.discount);
      setPromoCode(selectedPromo.code);
      setShowPromoDialog(false);
    } else if (promoCode === 'GIAM20') {
      setDiscount(20000);
      setShowPromoDialog(false);
    } else {
      alert('Mã khuyến mãi không hợp lệ!');
    }
  };

  const handleSelectPromo = (promo) => {
    setSelectedPromo(promo);
    setPromoCode(promo.code);
  };

  const handleUsePoints = () => {
    setUsePoints(!usePoints);
    setPointsDiscount(!usePoints ? 10000 : 0);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === 'eInvoice') {
      setShowQRDialog(true);
    } else {
      setShowQRDialog(false);
    }
  };

  const handleConfirmPayment = () => {
    if (!validate()) return;

    setIsProcessingPayment(true);
    // Giả lập kiểm tra thanh toán (3 giây)
    setTimeout(() => {
      setIsProcessingPayment(false);
      const order = {
        id: `ORDER-${Date.now()}`,
        cart: selectedCart,
        address,
        paymentMethod,
        totalPrice: getTotalPrice(),
        shippingFee: selectedTransport?.fee || 0,
        discount: discount + pointsDiscount,
        finalPrice: getTotalPrice() + (selectedTransport?.fee || 0) - (discount + pointsDiscount),
        timestamp: new Date().toISOString(),
      };

      // Lưu hóa đơn vào localStorage (giả lập cơ sở dữ liệu)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([...existingOrders, order]));

      alert('Thanh toán thành công! Hóa đơn đã được ghi nhận.');
      localStorage.removeItem('selectedCart');
      setShowQRDialog(false);
      navigate('/don-hang-cua-toi');
    }, 3000);
  };

  const handlePlaceOrder = () => {
    if (!validate()) return;
    if (paymentMethod === 'eInvoice') {
      setShowQRDialog(true);
    } else {
      const order = {
        id: `ORDER-${Date.now()}`,
        cart: selectedCart,
        address,
        paymentMethod,
        totalPrice: getTotalPrice(),
        shippingFee: selectedTransport?.fee || 0,
        discount: discount + pointsDiscount,
        finalPrice: getTotalPrice() + (selectedTransport?.fee || 0) - (discount + pointsDiscount),
        timestamp: new Date().toISOString(),
      };

      // Lưu hóa đơn vào localStorage (giả lập cơ sở dữ liệu)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([...existingOrders, order]));

      alert('Đặt hàng thành công!');
      localStorage.removeItem('selectedCart');
      navigate('/don-hang-cua-toi');
    }
  };

  const totalPrice = getTotalPrice();
  const shippingFee = selectedTransport ? selectedTransport.fee : 0;
  const totalDiscount = discount + pointsDiscount;
  const finalPrice = totalPrice + shippingFee - totalDiscount;

  if (selectedCart.length === 0) {
    return (
      <div className="empty-checkout">
        <p>Bạn chưa chọn sản phẩm nào để thanh toán.</p>
        <button onClick={() => navigate('/san-pham')}>Quay lại mua sắm</button>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      <div className="checkout-content">
        {/* Form địa chỉ */}
        <div className="checkout-address">
          <h3><EnvironmentOutlined /> Địa chỉ giao hàng</h3>
          {isEditingAddress ? (
            <>
              <label>
                Họ và tên <span className="required">*</span>
                <input
                  type="text"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? 'input-error' : ''}
                  placeholder="Nguyễn Văn A"
                />
                {errors.fullName && <small className="error">{errors.fullName}</small>}
              </label>
              <label>
                Số điện thoại <span className="required">*</span>
                <input
                  type="text"
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'input-error' : ''}
                  placeholder="0xxxxxxxxx"
                />
                {errors.phone && <small className="error">{errors.phone}</small>}
              </label>
              <label>
                Tỉnh/Thành phố <span className="required">*</span>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  className={errors.city ? 'input-error' : ''}
                  placeholder="Hồ Chí Minh"
                />
                {errors.city && <small className="error">{errors.city}</small>}
              </label>
              <label>
                Quận/Huyện <span className="required">*</span>
                <input
                  type="text"
                  name="district"
                  value={address.district}
                  onChange={handleChange}
                  className={errors.district ? 'input-error' : ''}
                  placeholder="Quận 1"
                />
                {errors.district && <small className="error">{errors.district}</small>}
              </label>
              <label>
                Phường/Xã <span className="required">*</span>
                <input
                  type="text"
                  name="ward"
                  value={address.ward}
                  onChange={handleChange}
                  className={errors.ward ? 'input-error' : ''}
                  placeholder="Phường Bến Nghé"
                />
                {errors.ward && <small className="error">{errors.ward}</small>}
              </label>
              <label>
                Địa chỉ cụ thể <span className="required">*</span>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleChange}
                  className={errors.street ? 'input-error' : ''}
                  placeholder="Số nhà, tên đường"
                />
                {errors.street && <small className="error">{errors.street}</small>}
              </label>
              <label>
                Ghi chú (không bắt buộc)
                <textarea
                  name="note"
                  value={address.note}
                  onChange={handleChange}
                  placeholder="Ví dụ: giao giờ hành chính"
                />
              </label>
              <button className="save-btn" onClick={() => setIsEditingAddress(false)}>Lưu</button>
            </>
          ) : (
            <div className="address-display">
              <p>{address.fullName} - {address.phone}</p>
              <p>{address.street}, {address.ward}, {address.district}, {address.city}</p>
              <p>Ghi chú: {address.note || 'Không có'}</p>
              <button onClick={() => setIsEditingAddress(true)}>
                <EditOutlined /> Chỉnh sửa
              </button>
            </div>
          )}
        </div>

        {/* Danh sách sản phẩm */}
        <div className="checkout-products">
          <h3><UserOutlined /> Sản phẩm của bạn</h3>
          {selectedCart.map(item => (
            <div key={item.maBienThe} className="checkout-product-item">
              <img src={item.hinhAnhUrl} alt={item.tenSanPham} />
              <div className="info">
                <p className="name">{item.tenSanPham}</p>
                <p>Màu: {item.mauSac} | Size: {item.size}</p>
                <p>Số lượng: {item.soLuong}</p>
                <p>Giá: {(item.gia * item.soLuong).toLocaleString()} ₫</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mã khuyến mãi */}
        <div className="checkout-promo">
          <h3>Mã khuyến mãi</h3>
          <div className="promo-section">
            <p onClick={() => setShowPromoDialog(true)}>
              {promoCode ? `Mã: ${promoCode} (-${discount.toLocaleString()} ₫)` : 'Chọn hoặc nhập mã khuyến mãi'}
            </p>
            {showPromoDialog && (
              <div className="promo-dialog">
                <h4>Chọn mã khuyến mãi</h4>
                {mockPromoCodes.map(promo => (
                  <label key={promo.code} className="promo-option">
                    <input
                      type="radio"
                      name="promo"
                      checked={selectedPromo?.code === promo.code}
                      onChange={() => handleSelectPromo(promo)}
                    />
                    <span>{promo.code} - {promo.description}</span>
                  </label>
                ))}
                <div className="promo-input">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      setSelectedPromo(null);
                    }}
                    placeholder="Nhập mã khuyến mãi"
                  />
                </div>
                <div className="promo-buttons">
                  <button onClick={handleApplyPromo}>Áp dụng</button>
                  <button onClick={() => setShowPromoDialog(false)}>Hủy</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tích điểm */}
        <div className="checkout-points">
          <h3>Sử dụng điểm tích lũy</h3>
          <label>
            <input
              type="checkbox"
              checked={usePoints}
              onChange={handleUsePoints}
            />
            Dùng điểm tích lũy ({availablePoints} điểm, giảm {pointsDiscount.toLocaleString()} ₫)
          </label>
        </div>

        {/* Phương thức vận chuyển */}
        <div className="checkout-transport">
          <h3>Phương thức vận chuyển</h3>
          <div className="transport-section">
            <p onClick={() => setShowTransportDialog(true)}>
              {selectedTransport
                ? `${selectedTransport.name} - ${selectedTransport.estimatedDelivery} (${selectedTransport.fee.toLocaleString()} ₫)`
                : 'Chọn phương thức vận chuyển'}
            </p>
            {showTransportDialog && (
             <div className="transport-dialog">
              {mockTransportOptions.map(option => (
                <div
                  key={option.id}
                  className="transport-option"
                  onClick={() => {
                    setSelectedTransport(option);
                    setShowTransportDialog(false);
                  }}
                >
                  <div>
                    <strong>{option.name}</strong> <br />
                    Phí: {option.fee.toLocaleString()} ₫ <br />
                    Nhận hàng dự kiến: {option.estimatedDelivery}
                  </div>
                </div>
              ))}
              <button onClick={() => setShowTransportDialog(false)}>Hủy</button>
            </div>

            )}
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div className="checkout-payment">
          <h3><CreditCardOutlined /> Phương thức thanh toán</h3>
          <label className="payment-option">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={() => handlePaymentMethodChange('cod')}
            />
            Thanh toán khi nhận hàng (COD)
          </label>
          <label className="payment-option">
            <input
              type="radio"
              name="paymentMethod"
              value="eInvoice"
              checked={paymentMethod === 'eInvoice'}
              onChange={() => handlePaymentMethodChange('eInvoice')}
            />
            Thanh toán hóa đơn điện tử <FileTextOutlined style={{ marginLeft: 6, color: '#3b82f6' }} />
          </label>
        </div>

        {/* Dialog mã QR */}
        {showQRDialog && (
          <div className="qr-dialog">
            <div className="qr-dialog-content">
              <h4>Thanh toán qua chuyển khoản</h4>
              <img
                src="https://via.placeholder.com/200x200?text=QR+Code"
                alt="QR Code"
                className="qr-code"
              />
              <div className="bank-info">
                <p><strong>Ngân hàng:</strong> Vietcombank</p>
                <p><strong>Số tài khoản:</strong> 1234567890</p>
                <p><strong>Chủ tài khoản:</strong> Công ty ABC</p>
                <p><strong>Nội dung chuyển khoản:</strong> ORDER-{Date.now()}</p>
                <p><strong>Số tiền:</strong> {finalPrice.toLocaleString()} ₫</p>
              </div>
              <div className="qr-buttons">
                <button
                  onClick={handleConfirmPayment}
                  disabled={isProcessingPayment}
                  className={isProcessingPayment ? 'processing' : ''}
                >
                  {isProcessingPayment ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
                </button>
                <button onClick={() => setShowQRDialog(false)}>Hủy</button>
              </div>
            </div>
          </div>
        )}

        {/* Tóm tắt đơn hàng */}
        <div className="checkout-summary">
          <h3>Tóm tắt đơn hàng</h3>
          <div className="summary-item">
            <span>Tổng tiền hàng:</span>
            <strong>{totalPrice.toLocaleString()} ₫</strong>
          </div>
          <div className="summary-item">
            <span>Tổng tiền phí vận chuyển:</span>
            <strong>{shippingFee.toLocaleString()} ₫</strong>
          </div>
          <div className="summary-item">
            <span>Tổng cộng khuyến mãi giảm giá:</span>
            <strong>{totalDiscount.toLocaleString()} ₫</strong>
          </div>
          <div className="summary-item">
            <span>Đã dùng tích điểm:</span>
            <strong>{pointsDiscount.toLocaleString()} ₫</strong>
          </div>
          <div className="summary-item">
            <span>Tổng tiền thanh toán:</span>
            <strong>{finalPrice.toLocaleString()} ₫</strong>
          </div>
          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;