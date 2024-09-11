import React from "react";
import "./HomeCards.css";
import { MdAnimation } from "react-icons/md";
import { TbRotate3D } from "react-icons/tb";
import { MdHighQuality } from "react-icons/md";

const HomeCards = () => {
  return (
    <div className="second-section-main-container">
      <h2 className="second-section-heading">
        Image-Cartoon-3D Transformation
      </h2>

      <div className="cards-container">
        <div>
          <MdAnimation className="card-icon" />
          <h3 className="card-heading">Cartoon</h3>
          <p className="card-description">
            Transform your photo into a cartoon with just one click—no need for
            complex editing skills.
          </p>
        </div>
        <div>
          <TbRotate3D className="card-icon" />
          <h3 className="card-heading">3D Transformation</h3>
          <p className="card-description">
            Transform your cartoon into a 3D model effortlessly with just one
            click—no special skills required.
          </p>
        </div>
        <div>
          <MdHighQuality className="card-icon" />
          <h3 className="card-heading">High-Quality Results</h3>
          <p className="card-description">
            Breathtaking 3D models from your cartoon visuals, all at your
            fingertips.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeCards;
