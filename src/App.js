import React, { useState, useRef } from 'react';
import qrCode from 'qrcode';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './styles.css';

function App() {
  const [text, setText] = useState('');
  const [qrCodeData, setQRCodeData] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [qrCodeHistory, setQRCodeHistory] = useState([]);
  const qrCodeRef = useRef(null);
  const [showHistory, setShowHistory] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [size, setSize] = useState(300);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState('H');

  const handleChange = (event) => {
    setText(event.target.value);
    setErrorMessage('');
  };

  const handleSizeChange = (event) => {
    setSize(parseInt(event.target.value, 10));
  };

  const handleECLChange = (event) => {
    setErrorCorrectionLevel(event.target.value);
  };

  const generateQRCode = () => {
    setErrorMessage('');

    if (!isURLValid(text) && !isEmailValid(text) && !isPhoneValid(text)) {
      setErrorMessage('Please enter a valid URL, email address, or phone number.');
      return;
    }

    if (isCodeDuplicate(text)) {
      setErrorMessage('A QR code with the same content already exists in the history.');
      return;
    }

    qrCode.toDataURL(
      text,
      { width: size, errorCorrectionLevel },
      (err, data) => {
        if (err) {
          console.error('Error generating QR code:', err);
          setErrorMessage('Error generating QR code. Please try again.');
        } else {
          const timestamp = new Date().getTime();
          setQRCodeData(data);
          setQRCodeHistory((prevHistory) => [
            ...prevHistory,
            { content: text, timestamp },
          ]);
        }
      }
    );
  };

  const isURLValid = (url) => {
    const urlRegex = /^(ftp|http|https):\/\/(?:www\.)?[^\s"']+$/;
    return urlRegex.test(url);
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPhoneValid = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const isCodeDuplicate = (content) => {
    const duplicate = qrCodeHistory.find((item) => item.content === content);
    if (duplicate) {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - duplicate.timestamp;
      const hoursDifference = timeDifference / (1000 * 60 * 60);
      return hoursDifference < 24;
    }
    return false;
  };

  const copyQRCode = () => {
    if (qrCodeRef.current) {
      qrCodeRef.current.select();
      document.execCommand('copy');
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeData;
    link.download = 'qr_code.png';
    link.click();
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const toggleCustomize = () => {
    setCustomizing(!customizing);
  };

  return (
    <div className="container">
      <h1 className="special-heading">Shubh QR Code Generator</h1>
      <input type="text" value={text} placeholder="Enter URL/Phone No./Email for QR code" onChange={handleChange} />
      {customizing ? (
        <>
          <div className="form-group">
            <label>QR Code Size:</label>
            <input
              type="number"
              value={size}
              onChange={handleSizeChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Error Correction Level:</label>
            <select
              value={errorCorrectionLevel}
              onChange={handleECLChange}
              className="form-control"
            >
              <option value="L">L</option>
              <option value="M">M</option>
              <option value="Q">Q</option>
              <option value="H">H</option>
            </select>
          </div>
        </>
      ) : (
        <button className="cust" onClick={toggleCustomize}>
          Customize
        </button>
      )}
      <button onClick={generateQRCode}>Generate QR Code</button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {qrCodeData && (
        <div className="qr-code-container">
          <img src={qrCodeData} alt="QR Code" className="qr-code" />
          <div className="qr-code-actions">
            <input type="text" ref={qrCodeRef} value={text} readOnly />
            <div>
              <button onClick={copyQRCode}>Copy</button>
              <button onClick={downloadQRCode}>Download</button>
            </div>
          </div>
          <p className="text-center mt-3">
            Scan the QR code with a QR code reader app
          </p>
        </div>
      )}
      <button className="hist" onClick={toggleHistory}>
        View History
      </button>

      {showHistory && (
        <div className="qr-code-history">
          <h2>QR Code History</h2>
          <ul>
            {qrCodeHistory.map((item, index) => (
              <li key={index}>
                <p>Content: {item.content}</p>
                <p>Timestamp: {new Date(item.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <footer className="footer">
        <p>Created by Shubham Mola</p>
        <p>Email: molashubham11@gmail.com</p>
        <p>&copy; Shubh QR Code Generator. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
