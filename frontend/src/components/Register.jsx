import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // frontend-only confirm/len check (po potrebi maknemo)
  const [passwordError, setPasswordError] = useState("");

  // ✅ backend field errors
  const [fieldErrors, setFieldErrors] = useState({}); // { email: "...", password:"..." }

  const navigate = useNavigate();

  const showModal = (msg, ms = 2000) => {
    setModalMessage(msg);
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), ms);
  };

  const shortError = (msg = "") => {
    const m = msg.toLowerCase();
    if (m.includes("validation failed")) return "Please fix highlighted fields.";
    if (m.includes("email is already in use")) return "This email is already in use.";
    return msg || "Request failed.";
  };

  // ✅ Parse Spring validation errors from plain text response
  const parseSpringFieldErrors = (message = "") => {
    const result = {};
    const temp = {};

    // pattern 1: on field 'email' ... default message [..]
    let regex = /on field '([^']+)':[\s\S]*?default message \[([^\]]+)\]/gi;
    let m;
    while ((m = regex.exec(message)) !== null) {
      const field = m[1];
      const msg = m[2];
      temp[field] = temp[field] || [];
      temp[field].push(msg);
    }

    // pattern 2: email': rejected value ... default message [..]
    if (Object.keys(temp).length === 0) {
      regex = /([A-Za-z0-9_]+)'\s*:\s*rejected value[\s\S]*?default message \[([^\]]+)\]/gi;
      while ((m = regex.exec(message)) !== null) {
        const field = m[1];
        const msg = m[2];
        temp[field] = temp[field] || [];
        temp[field].push(msg);
      }
    }

    Object.keys(temp).forEach((field) => {
      const arr = temp[field] || [];
      result[field] = arr[arr.length - 1]; // uzmi zadnju poruku
    });

    // ✅ fallback ako backend vrati samo "email" kao poruku
    if (result.email && result.email.trim().toLowerCase() === "email") {
      result.email = "Email format is not valid (example: name@domain.com).";
    }

    return result;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({ ...prev, [name]: value }));

    // ✅ clear backend error for this field while typing
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });

    // (optional) local password length check
    if (name === "password") {
      if (value.length > 0 && value.length < 6) setPasswordError("Password must be at least 6 characters");
      else setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // reset backend errors on each submit
    setFieldErrors({});

    if (user.password !== user.confirmPassword) {
      showModal("Passwords do not match", 3000);
      return;
    }

    if (user.password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch("http://localhost:8089/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
        }),
      });

      if (response.ok) {
        showModal("Registration successful!", 3000);
        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      const errorText = await response.text().catch(() => "");
      const fe = parseSpringFieldErrors(errorText);

      // ✅ map some common business errors
      const lower = (errorText || "").toLowerCase();
      if (lower.includes("email is already in use")) {
        fe.email = "This email is already in use. Try another one.";
      }

      if (Object.keys(fe).length > 0) {
        setFieldErrors(fe);
        showModal(shortError(errorText), 2500);
      } else {
        showModal(shortError(errorText), 2500);
      }
    } catch (error) {
      showModal("An error occurred: " + error.message, 2500);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          🎞️ <span className="cinema-red">Cinema</span>
          <span className="plus-white">Plus</span>
          <p className="welcome">Create your account</p>
          <p className="subtext">Enter your information to get started</p>
        </div>

        <div className="register-toggle">
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="name-fields">
            <input
              name="firstName"
              placeholder="First name"
              value={user.firstName}
              onChange={handleChange}
              className="input-half"
              required
            />
            <input
              name="lastName"
              placeholder="Last name"
              value={user.lastName}
              onChange={handleChange}
              className="input-half"
              required
            />
          </div>

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            className="input-full"
            required
          />
          {fieldErrors.email && <p className="error-message">{fieldErrors.email}</p>}

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            className="input-full"
            required
          />
          {/* backend password errors first, then local length error */}
          {fieldErrors.password && <p className="error-message">{fieldErrors.password}</p>}
          {!fieldErrors.password && passwordError && <p className="error-message">{passwordError}</p>}

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={user.confirmPassword}
            onChange={handleChange}
            className="input-full"
            required
          />

          <button type="submit" className="submit-btn">
            Create Account
          </button>
        </form>
      </div>

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <p>{modalMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
