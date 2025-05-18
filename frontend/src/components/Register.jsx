import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch('http://localhost:8089/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
        }),
      });

      if (response.ok) {
        alert("Registration successful!");
        navigate('/login');
      } else {
        const errorText = await response.text();
        alert("Registration failed: " + errorText);
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          🎞️ <span className="cinema-red">Cinema</span><span className="plus-white">Plus</span>
          <p className="welcome">Create your account</p>
          <p className="subtext">Enter your information to get started</p>
        </div>
        <div className="register-toggle">
          <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
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
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            className="input-full"
            required
          />
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
        <p className="terms-text">
          By continuing, you agree to our <span className="highlight">Terms of Service</span> and <span className="highlight">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}