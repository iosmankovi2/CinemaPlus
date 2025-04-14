import React, { useState } from 'react';
import { registerUser } from '../api';
import './Register.css';

export default function Register() {
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });

  const handleChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await registerUser(user);
      alert('Registration successful');
    } catch (err) {
      alert(err.response?.data || 'Error registering user');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
        🎞️ <span className="cinema-red">Cinem</span><span className="plus-white">Plus</span>
          <p className="welcome">Welcome back</p>
          <p className="subtext">Enter your credentials to access your account</p>
        </div>
        <div className="register-toggle">
          <button className="login-btn">Login</button>
          <button className="register-btn">Register</button>
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
        <div className="or-text">OR CONTINUE WITH</div>
        <div className="social-buttons">
          <button className="social-btn">Google</button>
          <button className="social-btn">Facebook</button>
        </div>
        <p className="terms-text">
          By continuing, you agree to our <span className="highlight">Terms of Service</span> and <span className="highlight">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
