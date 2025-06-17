import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './checkout.css';
import { FaTrash } from 'react-icons/fa';
import { UserOutlined, EnvironmentOutlined, CreditCardOutlined, EditOutlined } from '@ant-design/icons';
import { datHang, getDiaChiKhachHang, getKhuyenMai, getPhuongThucThanhToan, getDonViVanChuyen, addDiaChiKhachHang, updateDiaChiKhachHang, deleteDiaChiKhachHang } from '../../api/apiCheckOut';
import { useCart } from '../Cart/CartContext';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [selectedCart, setSelectedCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    city: '',
    district: '',
    ward: '',
    street: '',
    note: '',
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [transportUnits, setTransportUnits] = useState([]);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [promoCodes, setPromoCodes] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [showPromoDialog, setShowPromoDialog] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [errors, setErrors] = useState({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [expandedAddressId, setExpandedAddressId] = useState(null);
  const { fetchCartData } = useCart(); // lấy từ context



  // Lấy thông tin khách hàng từ localStorage
  const khachHangStr = localStorage.getItem('khachHang');
  const khachHang = khachHangStr ? JSON.parse(khachHangStr) : null;

  useEffect(() => {
    // Lấy danh sách sản phẩm đã chọn từ giỏ hàng
    const cart = JSON.parse(localStorage.getItem('selectedCart')) || [];
    setSelectedCart(cart);

    // Lấy danh sách địa chỉ của khách hàng
    const fetchAddresses = async () => {
      try {
        const response = await getDiaChiKhachHang(khachHang.maKH);
        setAddresses(response);
        const defaultAddress = response.find(addr => addr.macDinh) || response[0];
        setSelectedAddress(defaultAddress);
      } catch (error) {
        console.error('Lỗi khi lấy địa chỉ:', error);
      }
    };

    // Lấy danh sách phương thức thanh toán
    const fetchPaymentMethods = async () => {
      try {
        const response = await getPhuongThucThanhToan();
        setPaymentMethods(response);
        setSelectedPaymentMethod(response[0]?.maTT);
      } catch (error) {
        console.error('Lỗi khi lấy phương thức thanh toán:', error);
      }
    };

    // Lấy danh sách đơn vị vận chuyển
    const fetchTransportUnits = async () => {
      try {
        const response = await getDonViVanChuyen();
        setTransportUnits(response);
        setSelectedTransport(response[0]);
      } catch (error) {
        console.error('Lỗi khi lấy đơn vị vận chuyển:', error);
      }
    };

    // Lấy danh sách mã khuyến mãi
    const fetchPromoCodes = async () => {
      try {
        const response = await getKhuyenMai();
        setPromoCodes(response);
      } catch (error) {
        console.error('Lỗi khi lấy mã khuyến mãi:', error);
      }
    };

    if (khachHang) {
      fetchAddresses();
      fetchPaymentMethods();
      fetchTransportUnits();
      fetchPromoCodes();
    }
  }, []);
  useEffect(() => {
  const buyNowItemRaw = localStorage.getItem('selectedVariantForCheckout');
  if (buyNowItemRaw) {
    try {
      const parsed = JSON.parse(buyNowItemRaw);

      // Ép kiểu đảm bảo không bị string
      const buyNowItem = {
        ...parsed,
        giaBan: Number(parsed.giaBan),
        soLuong: Number(parsed.soLuong),
      };

      setSelectedCart([buyNowItem]);
      console.log("Dữ liệu mua ngay:", buyNowItem); 
    } catch (error) {
      console.error('Lỗi khi parse selectedVariantForCheckout:', error);
    }
  } else {
    const cart = JSON.parse(localStorage.getItem('selectedCart')) || [];
    setSelectedCart(cart);
  }

  // Lấy địa chỉ giao hàng
  const fetchAddresses = async () => {
    try {
      const response = await getDiaChiKhachHang(khachHang.maKH);
      setAddresses(response);
      const defaultAddress = response.find(addr => addr.macDinh) || response[0];
      setSelectedAddress(defaultAddress);
    } catch (error) {
      console.error('Lỗi khi lấy địa chỉ:', error);
    }
  };
  fetchAddresses();
}, []);


  // Tính tổng tiền hàng
  const getTotalPrice = () => {
    return selectedCart.reduce((sum, item) => sum + item.soLuong * item.giaBan, 0);
  };

  // Xử lý thay đổi địa chỉ
  const handleAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  // Xử lý chọn địa chỉ
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setIsEditingAddress(false);
    setEditingAddressId(null);
    setNewAddress({
      fullName: '',
      phone: '',
      city: '',
      district: '',
      ward: '',
      street: '',
      note: '',
    });
  };

  // Xử lý chỉnh sửa địa chỉ
  const handleEditAddress = (address) => {
    setIsEditingAddress(true);
    setEditingAddressId(address.maDiaChi);
    setNewAddress({
      fullName: address.hoTenNguoiNhan,
      phone: address.sdtNguoiNhan,
      city: address.tinhTP,
      district: address.huyenQuan,
      ward: address.xaPhuong,
      street: address.diaChiCuThe,
      note: address.ghiChu || '',
    });
  };

  // Xử lý xóa địa chỉ
  const handleDeleteAddress = async (maDiaChi) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      try {
        await deleteDiaChiKhachHang(maDiaChi);
        const updatedAddresses = addresses.filter(addr => addr.maDiaChi !== maDiaChi);
        setAddresses(updatedAddresses);
        if (selectedAddress?.maDiaChi === maDiaChi) {
          const defaultAddress = updatedAddresses.find(addr => addr.macDinh) || updatedAddresses[0] || null;
          setSelectedAddress(defaultAddress);
        }
        alert('Xóa địa chỉ thành công!');
      } catch (error) {
        console.error('Lỗi khi xóa địa chỉ:', error);
        alert(error.message || 'Đã có lỗi xảy ra khi xóa địa chỉ');
      }
    }
  };

  // Xử lý lưu địa chỉ (thêm mới hoặc cập nhật)
  const handleSaveAddress = async () => {
    if (!validateNewAddress()) return;

    try {
      if (editingAddressId) {
        // Cập nhật địa chỉ
        const updatedAddress = {
          maDiaChi: editingAddressId,
          hoTenNguoiNhan: newAddress.fullName,
          sdtNguoiNhan: newAddress.phone,
          tinhTP: newAddress.city,
          huyenQuan: newAddress.district,
          xaPhuong: newAddress.ward,
          diaChiCuThe: newAddress.street,
          ghiChu: newAddress.note,
          macDinh: selectedAddress?.maDiaChi === editingAddressId ? selectedAddress.macDinh : false,
        };
        await updateDiaChiKhachHang(updatedAddress);
        const updatedAddresses = addresses.map(addr =>
          addr.maDiaChi === editingAddressId ? updatedAddress : addr
        );
        setAddresses(updatedAddresses);
        setSelectedAddress(updatedAddress);
        alert('Cập nhật địa chỉ thành công!');
      } else {
        // Thêm địa chỉ mới
        const newAddr = {
          maKH: khachHang.maKH,
          hoTenNguoiNhan: newAddress.fullName,
          sdtNguoiNhan: newAddress.phone,
          tinhTP: newAddress.city,
          huyenQuan: newAddress.district,
          xaPhuong: newAddress.ward,
          diaChiCuThe: newAddress.street,
          ghiChu: newAddress.note,
          macDinh: addresses.length === 0, // Đặt mặc định nếu là địa chỉ đầu tiên
        };
        const response = await addDiaChiKhachHang(newAddr);
        setAddresses([...addresses, response]);
        setSelectedAddress(response);
        alert('Thêm địa chỉ thành công!');
      }
      setIsEditingAddress(false);
      setEditingAddressId(null);
      setNewAddress({
        fullName: '',
        phone: '',
        city: '',
        district: '',
        ward: '',
        street: '',
        note: '',
      });
    } catch (error) {
      console.error('Lỗi khi lưu địa chỉ:', error);
      alert(error.message || 'Đã có lỗi xảy ra khi lưu địa chỉ');
    }
  };

  // Xử lý chọn đơn vị vận chuyển
  const handleSelectTransport = (transport) => {
    setSelectedTransport(transport);
  };

  // Xử lý chọn mã khuyến mãi
  const handleSelectPromo = (promo) => {
    setSelectedPromo(promo);
    setDiscount(promo.phanTramGiam ? (getTotalPrice() * promo.phanTramGiam) / 100 : 0);
    setShowPromoDialog(false);
  };

  // Xử lý chọn phương thức thanh toán
  const handlePaymentMethodChange = (maTT) => {
    setSelectedPaymentMethod(maTT);
  };

  // Xử lý đặt hàng
  const handlePlaceOrder = async () => {
    let newErrors = {};
    if (!selectedAddress) {
      newErrors.address = 'Vui lòng chọn địa chỉ giao hàng';
    }
    if (!selectedPaymentMethod) {
      newErrors.paymentMethod = 'Vui lòng chọn phương thức thanh toán';
    }
    if (!selectedTransport) {
      newErrors.transport = 'Vui lòng chọn đơn vị vận chuyển';
    }
    if (!selectedCart || selectedCart.length === 0) {
    newErrors.cart = 'Giỏ hàng của bạn đang trống';
  }

  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) {
    return;
  }

    setIsProcessingPayment(true);
    try {
      const request = {
        maKH: khachHang.maKH,
        maNV: 'NV001',
        maDiaChi: selectedAddress.maDiaChi,
        maKM: selectedPromo && selectedPromo.maKM ? selectedPromo.maKM : null,
        maTT: selectedPaymentMethod,
        maDVVC: selectedTransport.maDVVC,
        ghiChu: (newAddress?.note || selectedAddress?.ghiChu || '').trim(),
        sanPhams: selectedCart.map(item => ({
          maBienThe: item.maBienThe,
          soLuong: item.soLuong,
          giaBan: item.giaBan,
          giamGia: selectedPromo && selectedPromo.phanTramGiam ? (item.giaBan * item.soLuong * selectedPromo.phanTramGiam) / 100 : 0,
        })),
      };

      const response = await datHang(request);
      localStorage.removeItem('selectedCart');
      await fetchCartData(); 
      toast.success(response.message || 'Đặt hàng thành công!');
      localStorage.removeItem('selectedCart');
      localStorage.removeItem('selectedVariantForCheckout');
      navigate('/don-hang-cua-toi');
      console.log('Request data:', request); 
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
      alert(error.message || 'Đã có lỗi xảy ra khi đặt hàng');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Validate form địa chỉ mới
  const validateNewAddress = () => {
    let newErrors = {};
    if (!newAddress.fullName.trim()) newErrors.fullName = 'Họ tên không được để trống';
    if (!newAddress.phone.trim()) newErrors.phone = 'Số điện thoại không được để trống';
    else if (!/^(0|\+84)[0-9]{9,10}$/.test(newAddress.phone)) newErrors.phone = 'Số điện thoại không hợp lệ';
    if (!newAddress.city.trim()) newErrors.city = 'Tỉnh/Thành phố không được để trống';
    if (!newAddress.district.trim()) newErrors.district = 'Quận/Huyện không được để trống';
    if (!newAddress.ward.trim()) newErrors.ward = 'Phường/Xã không được để trống';
    if (!newAddress.street.trim()) newErrors.street = 'Địa chỉ cụ thể không được để trống';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Tính toán tổng tiền
  const totalPrice = getTotalPrice();
  const shippingFee = selectedTransport ? selectedTransport.phiVanChuyen : 0;
  const totalDiscount = discount;
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
                  value={newAddress.fullName}
                  onChange={handleAddressChange}
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
                  value={newAddress.phone}
                  onChange={handleAddressChange}
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
                  value={newAddress.city}
                  onChange={handleAddressChange}
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
                  value={newAddress.district}
                  onChange={handleAddressChange}
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
                  value={newAddress.ward}
                  onChange={handleAddressChange}
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
                  value={newAddress.street}
                  onChange={handleAddressChange}
                  className={errors.street ? 'input-error' : ''}
                  placeholder="Số nhà, tên đường"
                />
                {errors.street && <small className="error">{errors.street}</small>}
              </label>
              <label>
                Ghi chú (không bắt buộc)
                <textarea
                  name="note"
                  value={newAddress.note}
                  onChange={handleAddressChange}
                  placeholder="Ví dụ: giao giờ hành chính"
                />
              </label>
              <div className="address-actions">
                <button
                  className="save-btn"
                  onClick={handleSaveAddress}
                >
                  {editingAddressId ? 'Cập nhật' : 'Lưu'}
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setIsEditingAddress(false);
                    setEditingAddressId(null);
                    setNewAddress({
                      fullName: '',
                      phone: '',
                      city: '',
                      district: '',
                      ward: '',
                      street: '',
                      note: '',
                    });
                    setErrors({});
                  }}
                >
                  Hủy
                </button>
              </div>
            </>
          ) : (
            <div className="address-display">
              {addresses.map((address) => (
                <div key={address.maDiaChi} className="address-item">
                  <div className="address-header">
                    <input
                      type="radio"
                      checked={selectedAddress?.maDiaChi === address.maDiaChi}
                      onChange={() => handleSelectAddress(address)}
                    />
                    <span className="address-info">
                      {address.hoTenNguoiNhan}, {address.sdtNguoiNhan}, {address.diaChiCuThe}, {address.xaPhuong}, {address.huyenQuan}, {address.tinhTP}
                    </span>
                    <button className="edit-button" onClick={() => {
                        if (expandedAddressId === address.maDiaChi) {
                          setExpandedAddressId(null);
                        } else {
                          setExpandedAddressId(address.maDiaChi);
                          handleEditAddress(address); // Đổ dữ liệu vào newAddress
                        }
                      }}
                      >
                      <EditOutlined /> Chỉnh sửa
                    </button>
                    <button  className="delete-button-dc" onClick={() => handleDeleteAddress(address.maDiaChi)}>
                          <FaTrash />
                        </button>
                  </div>

                  {expandedAddressId === address.maDiaChi && (
                    <div className="address-edit-form">
                      <label>
                        Họ và tên
                        <input
                          name="fullName"
                          value={newAddress.fullName}
                          onChange={handleAddressChange}
                        />
                      </label>
                      <label>
                        Số điện thoại
                        <input
                          name="phone"
                          value={newAddress.phone}
                          onChange={handleAddressChange}
                        />
                      </label>
                      <label>
                        Tỉnh/Thành phố
                        <input
                          name="city"
                          value={newAddress.city}
                          onChange={handleAddressChange}
                        />
                      </label>
                      <label>
                        Quận/Huyện
                        <input
                          name="district"
                          value={newAddress.district}
                          onChange={handleAddressChange}
                        />
                      </label>
                      <label>
                        Phường/Xã
                        <input
                          name="ward"
                          value={newAddress.ward}
                          onChange={handleAddressChange}
                        />
                      </label>
                      <label>
                        Địa chỉ cụ thể
                        <input
                          name="street"
                          value={newAddress.street}
                          onChange={handleAddressChange}
                        />
                      </label>
                      <label>
                        Ghi chú
                        <textarea
                          name="note"
                          value={newAddress.note}
                          onChange={handleAddressChange}
                        />
                      </label>
                      <div className="address-edit-actions">
                        <button onClick={handleSaveAddress}>Lưu</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <button
                className="add-address-btn"
                onClick={() => {
                  setIsEditingAddress(true);
                  setEditingAddressId(null);
                  setNewAddress({
                    fullName: '',
                    phone: '',
                    city: '',
                    district: '',
                    ward: '',
                    street: '',
                    note: '',
                  });
                }}
              >
                + Thêm địa chỉ mới
              </button>
              {errors.address && <small className="error">{errors.address}</small>}
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
                <p>Giá: {(item.giaBan * item.soLuong).toLocaleString()} ₫</p>
              </div>
            </div>
          ))}
        </div>

        {/* Đơn vị vận chuyển */}
        <div className="checkout-transport">
          <h3>Phương thức vận chuyển</h3>
          <div className="transport-section">
            {transportUnits.map(unit => (
              <label key={unit.maDVVC} className="transport-option">
                <input
                  type="radio"
                  name="transport"
                  value={unit.maDVVC}
                  checked={selectedTransport?.maDVVC === unit.maDVVC}
                  onChange={() => handleSelectTransport(unit)}
                />
                <span>{unit.tenDVVC} - Phí: {unit.phiVanChuyen.toLocaleString()} ₫</span>
              </label>
            ))}
            {errors.transport && <small className="error">{errors.transport}</small>}
          </div>
        </div>

        {/* Mã khuyến mãi */}
        <div className="checkout-promo">
          <h3>Mã khuyến mãi</h3>
          <div className="promo-section">
            <p onClick={() => setShowPromoDialog(true)}>
              {selectedPromo
                ? `Mã: ${selectedPromo.tenKM} (-${discount.toLocaleString()} ₫)`
                : 'Chọn mã khuyến mãi'}
            </p>
            {showPromoDialog && (
              <div className="promo-dialog">
                <h4>Chọn mã khuyến mãi</h4>
                {promoCodes.map(promo => (
                  <label key={promo.maKM} className="promo-option">
                    <input
                      type="radio"
                      name="promo"
                      checked={selectedPromo?.maKM === promo.maKM}
                      onChange={() => handleSelectPromo(promo)}
                    />
                    <span>{promo.tenKM} - Giảm {promo.phanTramGiam}%</span>
                  </label>
                ))}
                <div className="promo-buttons">
                  <button onClick={() => setShowPromoDialog(false)}>Hủy</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div className="checkout-payment">
          <h3><CreditCardOutlined /> Phương thức thanh toán</h3>
          {paymentMethods.map(method => (
            <label key={method.maTT} className="payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value={method.maTT}
                checked={selectedPaymentMethod === method.maTT}
                onChange={() => handlePaymentMethodChange(method.maTT)}
              />
              {method.tenTT}
            </label>
          ))}
          {errors.paymentMethod && <small className="error">{errors.paymentMethod}</small>}
        </div>

        {/* Tóm tắt đơn hàng */}
        <div className="checkout-summary">
          <h3>Tóm tắt đơn hàng</h3>
          <div className="summary-item">
            <span>Tổng tiền hàng:</span>
            <strong>{totalPrice.toLocaleString()} ₫</strong>
          </div>
          <div className="summary-item">
            <span>Phí vận chuyển:</span>
            <strong>{shippingFee.toLocaleString()} ₫</strong>
          </div>
          <div className="summary-item">
            <span>Tổng cộng khuyến mãi giảm giá:</span>
            <strong>{totalDiscount.toLocaleString()} ₫</strong>
          </div>
          <div className="summary-item">
            <span>Tổng tiền thanh toán:</span>
            <strong>{finalPrice.toLocaleString()} ₫</strong>
          </div>
          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={isProcessingPayment}
          >
            {isProcessingPayment ? 'Đang xử lý...' : 'Đặt hàng'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;