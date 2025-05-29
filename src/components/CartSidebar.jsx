
import React from 'react';
import './cartSidebar.css'; 

const CartSidebar = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="cart-sidebar">
      <button className="close-btn" onClick={onClose}>×</button>
      <h3>Giỏ hàng của bạn</h3>
      {children}
    </div>
  );
};

export default CartSidebar;
