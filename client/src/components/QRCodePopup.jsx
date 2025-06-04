import React from 'react';
import '../styles/components/_qrcode-popup.scss';

function QRCodePopup({ qrCode, onClose }) {
  return (
    <div className="qrcode-popup">
      <div className="qrcode-popup__content">
        <button className="qrcode-popup__close" onClick={onClose}>
          ×
        </button>
        <h2 className="qrcode-popup__title">QR Code</h2>
        <div className="qrcode-popup__image">
          <img src={qrCode} alt="QR Code" />
        </div>
        <p className="qrcode-popup__info">
          Scan this QR code to access the shortened URL
        </p>
      </div>
    </div>
  );
}

export default QRCodePopup;
