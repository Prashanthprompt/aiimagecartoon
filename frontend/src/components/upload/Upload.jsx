import React, { useState, useRef } from "react";
import "./Upload.css"; // Include your styles
import { FaPlus } from "react-icons/fa";
import GenerateModelForm from "../generateModelForm/GenerateModelForm";

const Upload = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a FormData object
      const formData = new FormData();
      formData.append("image", file);

      // Upload the image
      try {
        const response = await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.imageUrl) {
          setImageUrl(data.imageUrl);
          setImage(URL.createObjectURL(file));
        } else {
          console.error("Error uploading image:", data.error);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleImageUpload({ target: { files: [file] } });
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleChangeImage = () => {
    setImage(null);
    setImageUrl("");
  };

  return (
    <>
      <div className="modal">
        <div className="modal-content">
          {image ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div>
                <div className="uploaded-container">
                  <button className="change-btn" onClick={handleChangeImage}>
                    <FaPlus style={{ marginRight: "10px" }} /> Change Image
                  </button>
                </div>
                <img src={image} alt="Uploaded" className="uploaded-image" />
                <p className="uploaded-image-text">Original Image</p>
              </div>
              <GenerateModelForm imageUrl={imageUrl} />
            </div>
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
