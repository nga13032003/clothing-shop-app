// components/ChatBox.js
import React, { useState } from 'react';
import './chatbox.css';
import { facebook } from '../assets';

const ChatBox = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="chatbox-wrapper">
      {open ? (
        <div className="chatbox">
          <div className="chatbox-header">
            <span>Hỗ trợ khách hàng</span>
            <span className="close-btn" onClick={() => setOpen(false)}>×</span>
          </div>
          <div className="chatbox-body">
            <p>Xin chào! FASIC có thể giúp gì cho bạn?</p>
          </div>
          <div className="chatbox-input">
            <input type="text" placeholder="Nhập tin nhắn..." />
            <button>Gửi</button>
          </div>
        </div>
      ) : (
        <div className="chatbox-icon" onClick={() => setOpen(true)}>
          <img alt="Facebook" src={facebook} className="icon" />
        </div>
      )}
    </div>
  );
};

export default ChatBox;
