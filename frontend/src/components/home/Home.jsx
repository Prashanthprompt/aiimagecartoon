import React, { useState } from "react";
import "./Home.css";
import Cartoon from "../../assets/cartoon.png";
import { Link } from "react-router-dom";
import HomeCards from "../homeCards/HomeCards";

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-inner-main-container">
        <div className="first-section">
          <h2 className="heading-text">Convert Photo to Cartoon in Seconds</h2>
          <p className="description">
            Instantly turn your photos into cartoons with just one click using
            Fotor's AI-powered photo to cartoon converter. Upload your image and
            apply a delightful cartoon filter and effect today!
          </p>
          <Link to="/upload" className="cartoonize-button">
            Cartoonize your Photo
          </Link>
        </div>
        <div>
          <img src={Cartoon} alt="cartoon1" className="cartoon-img" />
        </div>
      </div>

      <div className="second-section-container">
        <HomeCards />
      </div>
    </div>
  );
};

export default Home;
