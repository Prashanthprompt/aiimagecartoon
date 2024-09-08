import React, { useEffect, useState } from "react";
import "./mainHome.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const MainHome = ({ images, setShowModifiedHome }) => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  const closeImage = () => {
    setIsVisible(false);
    setShowModifiedHome(false);
    navigate("/");
  };

  return (
    <>
      {isVisible && (
        <div className="main-home-container">
          <IoIosCloseCircleOutline onClick={closeImage} />
          <h1 className="main-home-title">
            Unleash the Power of 3D Creativity for Your Little Ones
          </h1>
          <p className="main-home-description">
            Discover the magic of transforming your child's drawings into
            captivating 3D characters that come alive with vibrant animations!
          </p>
          {images.map((image) =>
            image.title === "img1" ? (
              <img
                src={image.url}
                alt={image.title}
                className="main-home-img"
              />
            ) : (
              <img
                src={image.url}
                alt={image.title}
                className="main-home-alter-img"
              />
            )
          )}
        </div>
      )}
    </>
  );
};

export default MainHome;
