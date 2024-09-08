import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch } from "react-icons/fa";

const Navbar = ({
  handleSearch,
  openSearchModal,
  loginStatus,
  setLoginStatus,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.error("Logged out successfully");
    sessionStorage.removeItem("loginStatus");
    setLoginStatus(false);
    navigate("/login");
    sessionStorage.removeItem("displayProperties");
    // clearSavedVideos();
    localStorage.removeItem("savedVideos");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="nav-container">
      <div className="logo-and-items">
        <Link to="/" style={{ textDecoration: "none", color: "#f2f2f2" }}>
          <h1 className="logo">AI Image Replacer</h1>
        </Link>
        {loginStatus && (
          <div className="hamburger-menu" onClick={toggleMenu}>
            {/* Hamburger Icon */}
            <div className={`bar ${menuOpen ? "change" : ""}`}></div>
            <div className={`bar ${menuOpen ? "change" : ""}`}></div>
            <div className={`bar ${menuOpen ? "change" : ""}`}></div>
          </div>
        )}
      </div>

      <div className={`menu-items ${menuOpen ? "show" : ""}`}>
        {loginStatus && (
          <Link to="/" className="saved-videos-link" onClick={closeMenu}>
            Home
          </Link>
        )}
        {/* {loginStatus && (
          <Link
            to="/saved-videos"
            className="saved-videos-link"
            onClick={closeMenu}
          >
            <p>Saved Videos</p>
          </Link>
        )} */}
        {/* {loginStatus && (
          // <input
          //   type="text"
          //   className="search-input"
          //   placeholder="Search..."
          //   onClick={() => {
          //     openSearchModal();
          //     closeMenu();
          //   }}
          // />
          // <FaSearch
          //   className="search-icon"
          //   onClick={() => {
          //     openSearchModal();
          //     closeMenu();
          //   }}
          // />
        )} */}
        {/* <button className="signup-btn">SignUp</button> */}
        {loginStatus && (
          <button
            className="login-btn"
            onClick={() => {
              handleLogout();
              closeMenu();
            }}
          >
            Signout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
