import React, { useState, useRef } from "react";
import "./Upload.css"; // Include your styles
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import ConvertedImage from "../convertedImage/convertedImage";

const Upload = () => {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleChangeImage = () => {
    setImage(null);
  };

  return (
    <>
      {/* <button onClick={() => setIsOpen(true)}>Open Modal</button> */}
      <div className="modal">
        <div className="modal-content">
          {image ? (
            <>
              <div className="uploaded-container">
                <button className="change-btn" onClick={handleChangeImage}>
                  <FaPlus style={{ marginRight: "10px" }} /> Change Image
                </button>
              </div>
              <img src={image} alt="Uploaded" className="uploaded-image" />
              <Link to="/converted-image" className="transform-to-cartoon-btn">
                Transform to Cartoon
              </Link>
            </>
          ) : (
            <>
              <h2>Transform your photo into Cartoon ✨</h2>
              <div
                className="upload-area"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <small>Drag or Upload your photo here</small>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />
                <button className="upload-btn" onClick={handleButtonClick}>
                  Upload Image
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Upload;
