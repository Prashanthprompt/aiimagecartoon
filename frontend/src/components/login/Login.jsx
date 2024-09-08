import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setLoginStatus }) => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleMail = (e) => {
    setMail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mail === "aireplacer@gmail.com" && password === "ai@2024") {
      toast.success("Login Successful");
      sessionStorage.setItem("loginStatus", "true");
      setLoginStatus(true);
      navigate("/");
      sessionStorage.setItem("displayProperties", "false");
    } else {
      toast.error("Invalid credentials, please try again.");
    }
  };

  return (
    <div className="login-main-container">
      <h2 className="login-heading">Login</h2>
      <div className="login-form-container">
        <div>
          <label className="login-label" htmlFor="mail">
            Enter Mail:{" "}
          </label>
          <input
            className="login-input"
            type="email"
            id="mail"
            onChange={handleMail}
          />
        </div>
        <div>
          <label className="login-label" htmlFor="password">
            Enter Password:{" "}
          </label>
          <input
            className="login-input"
            type="password"
            id="password"
            onChange={handlePassword}
          />
        </div>
        <button
          type="submit"
          className="login-submit-btn"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Login;
