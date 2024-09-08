import React, { useState } from "react";
import "./ConvertedImage.css"; // Include your styles
import { FaDownload } from "react-icons/fa6";

const ConvertedImage = () => {
  const [isTransformed, setIsTransformed] = useState(false);
  const [threeDImage, setThreeDImage] = useState(null);

  const handleTransformTo3D = () => {
    // Simulate a transformation process
    // In a real scenario, you would probably make an API call here
    const transformedImage = "/path/to/3d-image.jpg"; // Placeholder path to the 3D image
    setThreeDImage(transformedImage);
    setIsTransformed(true);
  };

  return (
    <div className="converted-image-container">
      {!isTransformed && (
        <>
          <h2>Your Cartoon Image is Ready!</h2>
          <p>
            Here is your image transformed into a cartoon. Ready to take it to
            the next level?
          </p>

          <div className="image-block">
            <img
              src="https://via.placeholder.com/150"
              alt="Cartoon"
              className="cartoon-image"
            />
          </div>

          <button className="transform3d-btn" onClick={handleTransformTo3D}>
            Transform to 3D
          </button>
        </>
      )}

      {isTransformed && (
        <>
          <h3>Cartoon to 3D Transformation Complete!</h3>
          <p>Check out the 3D version of your image below:</p>
          <div className="image-block">
            <img
              src="https://via.placeholder.com/150"
              alt="3D Transformed"
              className="threeD-image"
            />
          </div>
          <a href={threeDImage} download="3d-transformed-image.jpg">
            <button className="download-btn">
              <FaDownload />
              Download
            </button>
          </a>
        </>
      )}
    </div>
  );
};

export default ConvertedImage;
